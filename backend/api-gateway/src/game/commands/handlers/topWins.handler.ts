import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { TopWinsCommand } from '../impl/topWins.command';
import { Inject, Logger, OnModuleInit } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { TopWinsModel } from '../../models/topWins.model';

@CommandHandler(TopWinsCommand)
export class TopWinsHandler
  implements OnModuleInit, ICommandHandler<TopWinsCommand>
{
  private readonly logger = new Logger('Top wins handler');

  constructor(
    @Inject('GAME_SERVICE') private readonly gameClient: ClientKafka,
  ) {}

  async onModuleInit() {
    this.gameClient.subscribeToResponseOf('top_wins');
    await this.gameClient.connect();
  }

  async execute(command: TopWinsCommand): Promise<TopWinsModel[]> {
    this.logger.log('Getting list of top wins');

    try {
      return await firstValueFrom<TopWinsModel[]>(
        this.gameClient.send('top_wins', JSON.stringify(command)),
      );
    } catch (e) {
      this.logger.error(e);
    }
  }
}
