import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ThreeCardsMonteCompleteCommand } from '../impl/three-cards-monte-complete.command';
import { Inject, Logger, OnModuleInit } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@CommandHandler(ThreeCardsMonteCompleteCommand)
export class ThreeCardsMonteCompleteHandler
  implements ICommandHandler<ThreeCardsMonteCompleteCommand>, OnModuleInit
{
  private readonly logger = new Logger('Three cards monte complete handler');

  constructor(
    @Inject('GAME_SERVICE') private readonly gameService: ClientKafka,
  ) {}

  async onModuleInit() {
    this.gameService.subscribeToResponseOf('monte_complete');
    await this.gameService.connect();
  }

  async execute(command: ThreeCardsMonteCompleteCommand): Promise<any> {
    try {
      return await firstValueFrom(
        this.gameService.send('monte_complete', JSON.stringify(command)),
      );
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }
}
