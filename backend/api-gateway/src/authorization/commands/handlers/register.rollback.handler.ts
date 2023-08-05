import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject, Logger, OnModuleInit } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { RegisterRollbackCommand } from '../impl/register-rollback.command';

@CommandHandler(RegisterRollbackCommand)
export class RegisterRollbackHandler
  implements ICommandHandler<RegisterRollbackCommand>, OnModuleInit
{
  private readonly logger = new Logger('Register rollback handler');

  constructor(
    @Inject('AUTH_SERVICE') private readonly authClient: ClientKafka,
    @Inject('USER_SERVICE') private readonly userClient: ClientKafka,
    @Inject('BALANCE_SERVICE') private readonly balanceClient: ClientKafka,
  ) {}

  async onModuleInit() {
    this.authClient.subscribeToResponseOf('auth_delete');
    this.userClient.subscribeToResponseOf('user_delete');
    this.balanceClient.subscribeToResponseOf('balance_delete');
    await this.authClient.connect();
    await this.userClient.connect();
    await this.balanceClient.connect();
  }

  async execute(command: RegisterRollbackCommand) {
    const { userId } = command;

    this.logger.log(`[${userId}]: Rolling back user creation`);

    try {
      await firstValueFrom(this.authClient.send('auth_delete', userId));
      this.logger.log(`[${userId}]: Auth user deleted`);
      await firstValueFrom(this.userClient.send('user_delete', userId));
      this.logger.log(`[${userId}]: User profile deleted`);
      await firstValueFrom(this.balanceClient.send('balance_delete', userId));
      this.logger.log(`[${userId}]: Balance deleted`);

      this.logger.log(`[${userId}]: Rollback successful`);
    } catch (e) {
      this.logger.error(`[${userId}]: Error on rollback`, e);
    }
  }
}
