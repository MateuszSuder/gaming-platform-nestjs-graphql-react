import { CommandBus, CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RegisterCommand } from '../impl/register.command';
import { Inject, Logger, OnModuleInit } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { RegisterRollbackCommand } from '../impl/register-rollback.command';

@CommandHandler(RegisterCommand)
export class RegisterHandler
  implements ICommandHandler<RegisterCommand>, OnModuleInit
{
  private readonly logger = new Logger('Register Handler');

  constructor(
    @Inject('AUTH_SERVICE') private readonly authClient: ClientKafka,
    @Inject('USER_SERVICE') private readonly userClient: ClientKafka,
    @Inject('BALANCE_SERVICE') private readonly balanceClient: ClientKafka,
    private commandBus: CommandBus,
  ) {}

  async onModuleInit() {
    this.authClient.subscribeToResponseOf('auth_create');
    this.userClient.subscribeToResponseOf('user_create');
    this.balanceClient.subscribeToResponseOf('balance_create');
    await this.authClient.connect();
    await this.userClient.connect();
    await this.balanceClient.connect();
  }

  async execute(command: RegisterCommand) {
    const {
      user: { username, ...user },
    } = command;
    this.logger.log(`Executing command for user "${username}"`);

    let userId: null | string = null;

    try {
      userId = await firstValueFrom<string>(
        this.authClient.send('auth_create', JSON.stringify(user)),
      );

      await firstValueFrom(
        this.userClient.send(
          'user_create',
          JSON.stringify({
            userId: userId,
            username,
          }),
        ),
      );

      await firstValueFrom(this.balanceClient.send('balance_create', userId));

      this.logger.log(`Created user "${username}"`);

      return userId;
    } catch (e) {
      this.logger.error(`Failed to create user "${username}"`, e);

      await this.commandBus.execute(new RegisterRollbackCommand(userId));

      throw e;
    }
  }
}
