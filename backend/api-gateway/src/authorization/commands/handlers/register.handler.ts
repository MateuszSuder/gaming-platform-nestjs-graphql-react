import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { RegisterCommand } from '../impl/register.command';
import { Inject, Logger, OnModuleInit } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@CommandHandler(RegisterCommand)
export class RegisterHandler
  implements ICommandHandler<RegisterCommand>, OnModuleInit
{
  private readonly logger = new Logger('Register Handler');

  constructor(
    @Inject('AUTH_SERVICE') private readonly authClient: ClientKafka,
    @Inject('USER_SERVICE') private readonly userClient: ClientKafka,
    @Inject('BALANCE_SERVICE') private readonly balanceClient: ClientKafka,
    private eventBus: EventBus,
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

    try {
      const authResult = await firstValueFrom(
        this.authClient.send('auth_create', JSON.stringify(user)),
      );

      console.log('Auth done');

      await firstValueFrom(
        this.userClient.send(
          'user_create',
          JSON.stringify({
            userId: authResult,
            username,
          }),
        ),
      );

      await firstValueFrom(
        this.balanceClient.send('balance_create', authResult),
      );

      this.logger.log(`Created user "${username}"`);

      return authResult;
    } catch (e) {
      this.logger.error(`Failed to create user "${username}"`, e);

      throw e;
    }
  }
}
