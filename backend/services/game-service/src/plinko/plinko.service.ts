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
import { firstValueFrom } from 'rxjs';
import { StartDto } from './dto/start.dto';
import { CompleteDto } from './dto/complete.dto';
import { Plinko } from './schemas/plinko.schema';
import { PlinkoResult } from './classes/plinko-result';

@Injectable()
export class PlinkoService implements IGameService, OnModuleInit {
  private readonly logger = new Logger('Plinko service');
  constructor(
    private configService: ConfigService,
    @InjectModel(Plinko.name)
    private readonly plinkoModel: Model<Plinko>,
    @Inject('BALANCE_SERVICE') private readonly balanceService: ClientKafka,
  ) {}

  async onModuleInit() {
    this.balanceService.subscribeToResponseOf('balance_add');
    this.balanceService.subscribeToResponseOf('balance_get');
    await this.balanceService.connect();
  }

  async getHighestWins(): Promise<{
    topWins: {
      win: number;
      userId: string;
      multiplier: number;
      game: 'Plinko';
    }[];
    topX: {
      win: number;
      userId: string;
      multiplier: number;
      game: 'Plinko';
    }[];
  }> {
    const topWins = await this.plinkoModel.aggregate([
      {
        $project: {
          win: 1,
          userId: 1,
          multiplier: 1,
          game: 'Plinko',
        },
      },
      {
        $match: { win: { $gt: 0 } },
      },
      {
        $sort: { win: -1 },
      },
      {
        $limit: 5,
      },
    ]);

    const topX = await this.plinkoModel.aggregate([
      {
        $project: {
          win: 1,
          userId: 1,
          multiplier: 1,
          game: 'Plinko',
        },
      },
      {
        $match: { win: { $gt: 0 } },
      },
      {
        $sort: { multiplier: -1 },
      },
      {
        $limit: 5,
      },
    ]);

    return {
      topWins,
      topX,
    };
  }

  async getGameHistory(userId: string) {
    return this.plinkoModel.find(
      {
        userId,
        isCompleted: true,
      },
      {
        game: 'Plinko',
        win: 1,
        multiplier: 1,
        bet: 1,
        createdAt: 1,
      },
    );
  }

  async init(userId: string) {
    const activeGame = await this.getActiveGame(userId);

    if (activeGame) {
      const { _id, pattern, win, bet, multiplier } = activeGame;

      return {
        ...this.getConfig(),
        _id,
        pattern,
        win,
        bet,
        multiplier,
      };
    }

    return this.getConfig();
  }

  async startGame({ userId, bet }: StartDto) {
    this.logger.log(`Got start for user ${userId} with bet ${bet}`);

    const activeGame = await this.getActiveGame(userId);

    if (activeGame) throw new RpcException('You have already started game');
    if (!this.getConfig().bets.includes(bet))
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

      const { pattern, multiplier, win } = new PlinkoResult(bet);

      const turn = new this.plinkoModel({
        userId,
        win,
        multiplier,
        pattern,
        bet,
        startedAt: new Date(),
      });

      const { _id } = await turn.save();

      return {
        _id,
        win,
        multiplier,
        pattern,
        bet,
      };
    } catch (e) {
      this.logger.error(e);

      throw e;
    }
  }

  async completeGame(completeGameInput: CompleteDto) {
    const { userId, gameId } = completeGameInput;
    this.logger.log(`Got complete for user ${userId} for game ${gameId}`);

    const gameObject = await this.plinkoModel.findOne({
      _id: gameId,
      userId,
      isCompleted: false,
    });

    if (!gameObject)
      throw new RpcException({
        message: 'Game not found',
        statusCode: HttpStatus.NOT_FOUND,
      });

    const { win } = gameObject;

    try {
      await this.plinkoModel.updateOne(
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
    return this.plinkoModel.findOne({ userId, isCompleted: false });
  }

  private getConfig() {
    return this.configService.getPlinkoConfig();
  }
}
