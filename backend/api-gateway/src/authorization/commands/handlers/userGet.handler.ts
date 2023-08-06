import { Inject, Logger, OnModuleInit } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UserGetCommand } from '../impl/userGet.command';
import { ClientKafka } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@CommandHandler(UserGetCommand)
export class UserGetHandler
  implements OnModuleInit, ICommandHandler<UserGetCommand>
{
  private readonly logger = new Logger('User get handler');
  constructor(
    @Inject('USER_SERVICE') private readonly userClient: ClientKafka,
  ) {}

  async onModuleInit() {
    this.userClient.subscribeToResponseOf('user_get');
    await this.userClient.connect();
  }

  async execute(command: UserGetCommand): Promise<any> {
    this.logger.log(`Getting user with ID ${command.userId}`);

    try {
      return await firstValueFrom(
        this.userClient.send(
          'user_get',
          JSON.stringify({
            ...command,
          }),
        ),
      );
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }
}
