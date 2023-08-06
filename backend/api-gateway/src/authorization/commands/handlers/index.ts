import { RegisterHandler } from './register.handler';
import { RegisterRollbackHandler } from './register.rollback.handler';
import { LoginHandler } from './login.handler';
import { VerifyHandler } from './verify.handler';
import { UserGetHandler } from './userGet.handler';
import { BalanceGetHandler } from './balanceGet.handler';
import { CommandHandlerType } from '@nestjs/cqrs';

export const CommandHandlers: CommandHandlerType[] = [
  RegisterHandler,
  RegisterRollbackHandler,
  LoginHandler,
  VerifyHandler,
  UserGetHandler,
  BalanceGetHandler,
];
