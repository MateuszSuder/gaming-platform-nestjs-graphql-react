import { PlinkoInitHandler } from './plinko-init.handler';
import { PlinkoStartHandler } from './plinko-start.handler';
import { PlinkoCompleteHandler } from './plinko-complete.handler';

export const CommandHandlers = [
  PlinkoInitHandler,
  PlinkoStartHandler,
  PlinkoCompleteHandler,
];
