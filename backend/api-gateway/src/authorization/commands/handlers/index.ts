import { RegisterHandler } from './register.handler';
import { RegisterRollbackHandler } from './register.rollback.handler';
import { LoginHandler } from './login.handler';
import { VerifyHandler } from './verify.handler';

export const CommandHandlers = [
  RegisterHandler,
  RegisterRollbackHandler,
  LoginHandler,
  VerifyHandler,
];
