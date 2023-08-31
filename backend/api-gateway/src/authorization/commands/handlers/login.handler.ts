import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { LoginCommand } from '../impl/login.command';
import { Inject, Logger, OnModuleInit } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@CommandHandler(LoginCommand)
export class LoginHandler
  implements ICommandHandler<LoginCommand>, OnModuleInit
{
  private readonly logger = new Logger('Login handler');

  constructor(
    @Inject('AUTH_SERVICE') private readonly authClient: ClientKafka,
  ) {}

  async onModuleInit() {
    this.authClient.subscribeToResponseOf('auth_login');
    await this.authClient.connect();
  }

  async execute(command: LoginCommand): Promise<any> {
    this.logger.log('Logging user');

    try {
      const result = await firstValueFrom<string>(
        this.authClient.send('auth_login', JSON.stringify(command)),
      );

      this.logger.log('Login successful');

      return result;
    } catch (e) {
      this.logger.error('Login unsuccessful');

      throw e;
    }
  }
}
