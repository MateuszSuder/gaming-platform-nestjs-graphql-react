import {
  HttpStatus,
  Inject,
  Injectable,
  Logger,
  OnModuleInit,
} from '@nestjs/common';
import { IGameService } from '../interfaces/game-service';
import { ConfigService } from '../config/config.service';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ClientKafka, RpcException } from '@nestjs/microservices';
import { SevenFruits } from './schemas/seven-fruits.schema';
import { firstValueFrom } from 'rxjs';
import { SevenFruitsSpin } from './classes/seven-fruits-spin';
import { StartDto } from './dto/start.dto';
import { CompleteDto } from './dto/complete.dto';

@Injectable()
export class SevenFruitsService implements IGameService, OnModuleInit {
  private readonly logger = new Logger('777 Fruits service');
  constructor(
    private configService: ConfigService,
    @InjectModel(SevenFruits.name)
    private readonly sevenFruitsModel: Model<SevenFruits>,
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
      const { _id, gameResult } = activeGame;

      return {
        ...this.getConfig(),
        _id,
        gameResult,
      };
    }

    return this.getConfig();
  }

  async startGame({ userId, bet }: StartDto) {
    this.logger.log(`Got start for user ${userId} with bet ${bet}`);

    const activeGame = await this.getActiveGame(userId);

    if (activeGame) throw new RpcException('You have already started game');
    if (!this.configService.getFruitsConfig().bets.includes(bet))
      throw new RpcException({
        message: 'Invalid bet',
        statusCode: HttpStatus.BAD_REQUEST,
      });

    this.logger.log(`Sending balance add with amount ${-bet}`);

    try {
      await firstValueFrom(
        this.balanceService.send(
          'balance_add',
          JSON.stringify({ toAdd: -bet, userId }),
        ),
      );

      const { symbols, multiplier, win, winningLines } = new SevenFruitsSpin(
        bet,
      );

      const turn = new this.sevenFruitsModel({
        userId,
        gameResult: {
          win,
          multiplier,
          winningLines,
          symbols,
          bet,
        },
        startedAt: new Date(),
      });

      const { _id } = await turn.save();

      return {
        _id,
        gameResult: {
          win,
          multiplier,
          winningLines,
          symbols,
          bet,
        },
      };
    } catch (e) {
      this.logger.error(e);

      throw e;
    }
  }

  async completeGame(completeGameInput: CompleteDto) {
    const { userId, gameId } = completeGameInput;
    this.logger.log(`Got complete for user ${userId} for game ${gameId}`);

    const gameObject = await this.sevenFruitsModel.findOne({
      _id: gameId,
      userId,
    });

    if (!gameObject)
      throw new RpcException({
        message: 'Game not found',
        statusCode: HttpStatus.NOT_FOUND,
      });

    const {
      gameResult: { win },
    } = gameObject;

    try {
      await this.sevenFruitsModel.updateOne(
        { _id: gameObject._id, userId },
        { isCompleted: true },
      );

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
    return this.sevenFruitsModel.findOne({ userId, isCompleted: false });
  }

  private getConfig() {
    return this.configService.getThreeCardsMonteConfig();
  }
}
