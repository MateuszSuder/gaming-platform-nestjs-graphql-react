import { Inject, Logger, OnModuleInit } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SevenFruitsCompleteCommand } from '../impl/seven-fruits-complete.command';
import { ClientKafka } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@CommandHandler(SevenFruitsCompleteCommand)
export class SevenFruitsCompleteHandler
  implements OnModuleInit, ICommandHandler<SevenFruitsCompleteCommand>
{
  private readonly logger = new Logger('Three cards monte start handler');

  constructor(
    @Inject('GAME_SERVICE') private readonly gameService: ClientKafka,
  ) {}

  async onModuleInit() {
    this.gameService.subscribeToResponseOf('fruits_complete');
    await this.gameService.connect();
  }
  async execute(command: SevenFruitsCompleteCommand) {
    try {
      return await firstValueFrom(
        this.gameService.send('fruits_complete', JSON.stringify(command)),
      );
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }
}
