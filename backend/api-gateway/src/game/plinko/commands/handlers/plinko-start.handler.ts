import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject, Logger, OnModuleInit } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { PlinkoStartCommand } from '../impl/plinko-start.command';

@CommandHandler(PlinkoStartCommand)
export class PlinkoStartHandler
  implements ICommandHandler<PlinkoStartCommand>, OnModuleInit
{
  private readonly logger = new Logger('Plinko start handler');

  constructor(
    @Inject('GAME_SERVICE') private readonly gameService: ClientKafka,
  ) {}

  async onModuleInit() {
    this.gameService.subscribeToResponseOf('plinko_start');
    await this.gameService.connect();
  }

  async execute(command: PlinkoStartCommand) {
    this.logger.log(`Got plinko start with bet ${command.bet}`);
    try {
      return await firstValueFrom(
        this.gameService.send('plinko_start', JSON.stringify(command)),
      );
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }
}
