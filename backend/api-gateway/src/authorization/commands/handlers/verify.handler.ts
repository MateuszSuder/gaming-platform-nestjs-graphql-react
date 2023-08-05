import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { VerifyCommand } from '../impl/verify.command';
import { Inject, Logger, OnModuleInit } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@CommandHandler(VerifyCommand)
export class VerifyHandler
  implements ICommandHandler<VerifyCommand>, OnModuleInit
{
  private readonly logger = new Logger('Verify handler');

  constructor(
    @Inject('AUTH_SERVICE') private readonly authClient: ClientKafka,
  ) {}

  onModuleInit(): any {
    this.authClient.subscribeToResponseOf('auth_verify');
  }

  async execute(command: VerifyCommand): Promise<any> {
    const { token } = command;
    return await firstValueFrom(this.authClient.send('auth_verify', token));
  }
}
