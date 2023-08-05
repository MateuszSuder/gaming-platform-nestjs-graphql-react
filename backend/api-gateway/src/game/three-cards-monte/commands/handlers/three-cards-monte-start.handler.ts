import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject, Logger, OnModuleInit } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { ThreeCardsMonteStartCommand } from '../impl/three-cards-monte-start.command';

@CommandHandler(ThreeCardsMonteStartCommand)
export class ThreeCardsMonteStartHandler
  implements ICommandHandler<ThreeCardsMonteStartCommand>, OnModuleInit
{
  private readonly logger = new Logger('Three cards monte start handler');

  constructor(
    @Inject('GAME_SERVICE') private readonly gameService: ClientKafka,
  ) {}

  async onModuleInit() {
    this.gameService.subscribeToResponseOf('monte_start');
    await this.gameService.connect();
  }

  async execute(command: ThreeCardsMonteStartCommand) {
    try {
      return await firstValueFrom(
        this.gameService.send('monte_start', JSON.stringify(command)),
      );
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }
}
