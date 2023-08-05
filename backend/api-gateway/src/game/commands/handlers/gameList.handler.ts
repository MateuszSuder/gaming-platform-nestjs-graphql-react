import {CommandHandler, ICommandHandler} from '@nestjs/cqrs';
import {GameListCommand} from '../impl/gameList.command';
import {Inject, Logger, OnModuleInit} from '@nestjs/common';
import {ClientKafka} from '@nestjs/microservices';
import {firstValueFrom} from 'rxjs';
import {GameModel} from '../../models/game.model';

@CommandHandler(GameListCommand)
export class GameListHandler
  implements ICommandHandler<GameListCommand>, OnModuleInit
{
  private readonly logger = new Logger('Game list handler');
  constructor(
    @Inject('GAME_SERVICE') private readonly gameClient: ClientKafka,
  ) {}
  async onModuleInit() {
    this.gameClient.subscribeToResponseOf('game_list');
    await this.gameClient.connect();
  }

  async execute(command: GameListCommand): Promise<GameModel[]> {
    this.logger.log('Getting list of games');

    try {
      return await firstValueFrom<GameModel[]>(
        this.gameClient.send('game_list', JSON.stringify(command)),
      );
    } catch (e) {
      this.logger.error(e);
    }
  }
}
