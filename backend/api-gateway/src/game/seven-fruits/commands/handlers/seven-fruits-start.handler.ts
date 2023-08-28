import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject, Logger, OnModuleInit } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { SevenFruitsStartCommand } from '../impl/seven-fruits-start.command';

@CommandHandler(SevenFruitsStartCommand)
export class SevenFruitsStartHandler
  implements OnModuleInit, ICommandHandler<SevenFruitsStartCommand>
{
  private readonly logger = new Logger('Three cards monte start handler');

  constructor(
    @Inject('GAME_SERVICE') private readonly gameService: ClientKafka,
  ) {}

  async onModuleInit() {
    this.gameService.subscribeToResponseOf('fruits_start');
    await this.gameService.connect();
  }

  async execute(command: SevenFruitsStartCommand) {
    try {
      return await firstValueFrom(
        this.gameService.send('fruits_start', JSON.stringify(command)),
      );
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }
}
