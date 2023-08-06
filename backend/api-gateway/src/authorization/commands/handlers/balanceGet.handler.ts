import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BalanceGetCommand } from '../impl/balanceGet.command';
import { Inject, Logger, OnModuleInit } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@CommandHandler(BalanceGetCommand)
export class BalanceGetHandler
  implements ICommandHandler<BalanceGetCommand>, OnModuleInit
{
  private readonly logger = new Logger('Balance get handler');

  constructor(
    @Inject('BALANCE_SERVICE') private readonly balanceService: ClientKafka,
  ) {}

  async onModuleInit() {
    this.balanceService.subscribeToResponseOf('balance_get');
    await this.balanceService.connect();
  }

  async execute(command: BalanceGetCommand) {
    this.logger.log(`Getting balance for user ${command.userId}`);
    const { userId } = command;
    try {
      return await firstValueFrom(
        this.balanceService.send('balance_get', userId),
      );
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }
}
