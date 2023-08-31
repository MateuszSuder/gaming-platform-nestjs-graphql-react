import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from './config/config.service';
import { SevenFruitsService } from './seven-fruits/seven-fruits.service';
import { ThreeCardsMonteService } from './three-cards-monte/three-cards-monte.service';
import { ClientKafka } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { PlinkoService } from './plinko/plinko.service';
import { GameHistoryDto } from './dto/gameHistoryDto';

@Injectable()
export class AppService implements OnModuleInit {
  private readonly logger = new Logger('App service');
  constructor(
    private configService: ConfigService,
    private readonly sevenFruitsService: SevenFruitsService,
    private readonly threeCardsMonteService: ThreeCardsMonteService,
    private readonly plinkoService: PlinkoService,
    @Inject('USER_SERVICE') private readonly userClient: ClientKafka,
  ) {}

  async onModuleInit() {
    this.userClient.subscribeToResponseOf('user_get');
    await this.userClient.connect();
  }

  gameList() {
    this.logger.log('Returning list of games');
    return this.configService.getGameList();
  }

  categoryList() {
    return this.configService.getCategories();
  }

  async topWins() {
    const tcm = await this.threeCardsMonteService.getHighestWins();
    const sf = await this.sevenFruitsService.getHighestWins();
    const p = await this.plinkoService.getHighestWins();

    const topWins = [...tcm.topWins, ...sf.topWins, ...p.topWins]
      .sort((a, b) => a.win - b.win)
      .slice(-5);
    const topMultipliers = [...tcm.topX, ...sf.topX, ...p.topX]
      .sort((a, b) => a.multiplier - b.multiplier)
      .slice(-5);

    const idToUserMap = {};

    for (const win of [...topWins, ...topMultipliers]) {
      if (!(win.userId in idToUserMap)) {
        const user = await firstValueFrom(
          this.userClient.send(
            'user_get',
            JSON.stringify({ userId: win.userId }),
          ),
        );

        idToUserMap[win.userId] = user.username;
      }
    }

    return {
      topWins: topWins.map(({ userId, ...rest }) => ({
        username: idToUserMap[userId],
        ...rest,
      })),
      topMultipliers: topMultipliers.map(({ userId, ...rest }) => ({
        username: idToUserMap[userId],
        ...rest,
      })),
    };
  }

  async gameHistory(gameHistoryInput: GameHistoryDto) {
    this.logger.log(`Getting game history for ${gameHistoryInput.userId}`);
    const plinkoHistory = await this.plinkoService.getGameHistory(
      gameHistoryInput.userId,
    );

    const sevenFruitsHistory = await this.sevenFruitsService.getGameHistory(
      gameHistoryInput.userId,
    );

    const threeCardMonteHistory =
      await this.threeCardsMonteService.getGameHistory(gameHistoryInput.userId);

    return [
      ...plinkoHistory,
      ...sevenFruitsHistory,
      ...threeCardMonteHistory,
    ].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
  }
}
