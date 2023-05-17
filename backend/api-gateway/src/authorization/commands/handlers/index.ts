import { RegisterHandler } from './register.handler';
import { RegisterRollbackHandler } from './register.rollback.handler';
import { LoginHandler } from './login.handler';

export const CommandHandlers = [
  RegisterHandler,
  RegisterRollbackHandler,
  LoginHandler,
];
