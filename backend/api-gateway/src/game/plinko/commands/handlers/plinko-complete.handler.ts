import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PlinkoCompleteCommand } from '../impl/plinko-complete.command';
import { Inject, Logger, OnModuleInit } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@CommandHandler(PlinkoCompleteCommand)
export class PlinkoCompleteHandler
  implements ICommandHandler<PlinkoCompleteCommand>, OnModuleInit
{
  private readonly logger = new Logger('Plinko complete handler');

  constructor(
    @Inject('GAME_SERVICE') private readonly gameService: ClientKafka,
  ) {}

  async onModuleInit() {
    this.gameService.subscribeToResponseOf('plinko_complete');
    await this.gameService.connect();
  }

  async execute(command: PlinkoCompleteCommand): Promise<any> {
    try {
      return await firstValueFrom(
        this.gameService.send('plinko_complete', JSON.stringify(command)),
      );
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }
}
