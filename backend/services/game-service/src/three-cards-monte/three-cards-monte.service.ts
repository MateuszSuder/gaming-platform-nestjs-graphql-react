import {
  HttpStatus,
  Inject,
  Injectable,
  Logger,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '../config/config.service';
import { IGameService } from '../interfaces/game-service';
import { InjectModel } from '@nestjs/mongoose';
import { ThreeCardsMonte } from './schemas/three-cards-monte.schema';
import { Model } from 'mongoose';
import { ThreeCardsMonteTurn } from './three-cards-monte-turn/three-cards-monte-turn';
import { ClientKafka, RpcException } from '@nestjs/microservices';
import { StartDto } from './dto/start.dto';
import { CompleteDto } from './dto/complete.dto';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class ThreeCardsMonteService implements IGameService, OnModuleInit {
  private readonly logger = new Logger('Three cards monte service');

  constructor(
    private configService: ConfigService,
    @InjectModel(ThreeCardsMonte.name)
    private readonly threeCardMonteModel: Model<ThreeCardsMonte>,
    @Inject('BALANCE_SERVICE') private readonly balanceService: ClientKafka,
  ) {}

  async onModuleInit() {
    this.balanceService.subscribeToResponseOf('balance_add');
    this.balanceService.subscribeToResponseOf('balance_get');
    await this.balanceService.connect();
  }

  async init(userId: string) {
    const activeGame = await this.getActiveGame(userId);

    if (activeGame) {
      const { _id, win, bet, winningCard } = activeGame;

      return {
        ...this.getConfig(),
        _id,
        win,
        bet,
        winningCard,
      };
    }

    return this.getConfig();
  }

  async startGame({ userId, bet, cardNumber }: StartDto) {
    this.logger.log(`Got start for user ${userId} with bet ${bet}`);
    const activeGame = await this.getActiveGame(userId);

    if (activeGame) throw new RpcException('You have already started game');
    if (!this.configService.getThreeCardsMonteConfig().bets.includes(bet))
      throw new RpcException({
        message: 'Invalid bet',
        statusCode: HttpStatus.BAD_REQUEST,
      });

    this.logger.log(`Sending balance add with amount ${-bet}`);

    try {
      const response = await firstValueFrom(
        this.balanceService.send(
          'balance_add',
          JSON.stringify({ toAdd: -bet, userId }),
        ),
      );

      console.log(response);

      const { multiplier, drawnCard } = new ThreeCardsMonteTurn(cardNumber);
      const win = bet * multiplier;

      const turn = new this.threeCardMonteModel({
        userId,
        bet,
        multiplier,
        startedAt: new Date(),
        win,
        winningCard: drawnCard,
      });

      const { _id } = await turn.save();

      return { _id, winningCard: drawnCard, win };
    } catch (e) {
      this.logger.error(e);

      throw e;
    }
  }

  async completeGame(completeGameInput: CompleteDto) {
    const { userId, gameId } = completeGameInput;
    this.logger.log(`Got complete for user ${userId} for game ${gameId}`);
    const gameObject = await this.threeCardMonteModel.findOne({
      _id: gameId,
      userId,
    });

    if (!gameObject)
      throw new RpcException({
        message: 'Game not found',
        statusCode: HttpStatus.NOT_FOUND,
      });

    const { win } = gameObject;

    try {
      await this.threeCardMonteModel.deleteOne({ _id: gameObject._id });

      if (win) {
        return await firstValueFrom(
          this.balanceService.send(
            'balance_add',
            JSON.stringify({ userId, toAdd: win }),
          ),
        );
      }

      return await firstValueFrom(
        this.balanceService.send('balance_get', userId),
      );
    } catch (e) {
      this.logger.error(e);
    }
  }

  private async getActiveGame(userId: string) {
    return this.threeCardMonteModel.findOne({ userId });
  }

  private getConfig() {
    return this.configService.getThreeCardsMonteConfig();
  }
}
