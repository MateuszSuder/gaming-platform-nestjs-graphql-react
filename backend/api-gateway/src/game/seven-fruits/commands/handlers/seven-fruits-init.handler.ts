import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SevenFruitsInitCommand } from '../impl/seven-fruits-init.command';
import { Inject, Logger, OnModuleInit } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@CommandHandler(SevenFruitsInitCommand)
export class SevenFruitsInitHandler
  implements OnModuleInit, ICommandHandler<SevenFruitsInitCommand>
{
  private readonly logger = new Logger('Three cards monte init handler');

  constructor(
    @Inject('GAME_SERVICE') private readonly gameService: ClientKafka,
  ) {}

  async onModuleInit() {
    this.gameService.subscribeToResponseOf('fruits_init');
    await this.gameService.connect();
  }

  async execute(command: SevenFruitsInitCommand) {
    const { userId } = command;

    try {
      return await firstValueFrom(this.gameService.send('fruits_init', userId));
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }
}
