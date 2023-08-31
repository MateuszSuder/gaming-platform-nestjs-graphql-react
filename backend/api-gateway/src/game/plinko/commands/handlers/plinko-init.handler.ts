import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject, Logger, OnModuleInit } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { PlinkoInitCommand } from '../impl/plinko-init.command';

@CommandHandler(PlinkoInitCommand)
export class PlinkoInitHandler
  implements ICommandHandler<PlinkoInitCommand>, OnModuleInit
{
  private readonly logger = new Logger('Plinko init handler');

  constructor(
    @Inject('GAME_SERVICE') private readonly gameService: ClientKafka,
  ) {}

  async onModuleInit() {
    this.gameService.subscribeToResponseOf('plinko_init');
    await this.gameService.connect();
  }

  async execute(command: PlinkoInitCommand) {
    const { userId } = command;

    try {
      return await firstValueFrom(this.gameService.send('plinko_init', userId));
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }
}
