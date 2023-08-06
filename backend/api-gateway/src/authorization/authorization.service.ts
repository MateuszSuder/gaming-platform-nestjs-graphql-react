import { Injectable } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { RegisterCommand } from './commands/impl/register.command';
import { CommandBus } from '@nestjs/cqrs';
import { LoginDto } from './dto/login.dto';
import { LoginCommand } from './commands/impl/login.command';
import { UserGetCommand } from './commands/impl/userGet.command';
import { BalanceGetCommand } from './commands/impl/balanceGet.command';

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

  async getUser(userId: string) {
    const user = await this.commandBus.execute<
      UserGetCommand,
      { username: string }
    >(new UserGetCommand(userId));

    const balance = await this.commandBus.execute<
      BalanceGetCommand,
      { balance: number }
    >(new BalanceGetCommand(userId));

    return {
      username: user.username,
      balance: balance.balance,
    };
  }
}
