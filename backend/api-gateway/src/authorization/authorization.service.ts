import { Injectable } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { RegisterCommand } from './commands/impl/register.command';
import { CommandBus } from '@nestjs/cqrs';

@Injectable()
export class AuthorizationService {
  constructor(private readonly commandBus: CommandBus) {}

  async createUser(userData: RegisterDto) {
    return this.commandBus.execute(new RegisterCommand(userData));
  }
}
