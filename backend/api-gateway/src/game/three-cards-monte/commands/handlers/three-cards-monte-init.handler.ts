import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject, Logger, OnModuleInit } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { ThreeCardsMonteInitCommand } from '../impl/three-cards-monte-init.command';

@CommandHandler(ThreeCardsMonteInitCommand)
export class ThreeCardsMonteInitHandler
  implements ICommandHandler<ThreeCardsMonteInitCommand>, OnModuleInit
{
  private readonly logger = new Logger('Three cards monte init handler');

  constructor(
    @Inject('GAME_SERVICE') private readonly gameService: ClientKafka,
  ) {}

  async onModuleInit() {
    this.gameService.subscribeToResponseOf('monte_init');
    await this.gameService.connect();
  }

  async execute(command: ThreeCardsMonteInitCommand) {
    const { userId } = command;

    try {
      return await firstValueFrom(this.gameService.send('monte_init', userId));
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }
}
