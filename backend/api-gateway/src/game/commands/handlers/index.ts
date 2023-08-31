import { GameListHandler } from './gameList.handler';
import { CategoryListHandler } from './categoryList.handler';
import { TopWinsHandler } from './topWins.handler';
import { GameHistoryHandler } from './gameHistory.handler';

export const GameCommandHandlers = [
  GameListHandler,
  CategoryListHandler,
  TopWinsHandler,
  GameHistoryHandler,
];
