import { Injectable } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { RegisterCommand } from './commands/impl/register.command';
import { CommandBus } from '@nestjs/cqrs';
import { LoginDto } from './dto/login.dto';
import { LoginCommand } from './commands/impl/login.command';

@Injectable()
export class AuthorizationService {
  constructor(private readonly commandBus: CommandBus) {}

  async createUser(userData: RegisterDto) {
    return this.commandBus.execute(new RegisterCommand(userData));
  }

  async login(userData: LoginDto) {
    const { email, password } = userData;
    return await this.commandBus.execute(new LoginCommand(email, password));
  }
}
