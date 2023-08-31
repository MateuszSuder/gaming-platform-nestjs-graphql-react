import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject, Logger, OnModuleInit } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { GameHistoryCommand } from '../impl/gameHistory.command';

@CommandHandler(GameHistoryCommand)
export class GameHistoryHandler
  implements OnModuleInit, ICommandHandler<GameHistoryCommand>
{
  private readonly logger = new Logger('Top wins handler');

  constructor(
    @Inject('GAME_SERVICE') private readonly gameClient: ClientKafka,
  ) {}

  async onModuleInit() {
    this.gameClient.subscribeToResponseOf('game_history');
    await this.gameClient.connect();
  }

  async execute(command: GameHistoryCommand) {
    this.logger.log(`Getting game history for ${command.userId}`);

    try {
      return await firstValueFrom(
        this.gameClient.send('game_history', JSON.stringify(command)),
      );
    } catch (e) {
      this.logger.error(e);
    }
  }
}
