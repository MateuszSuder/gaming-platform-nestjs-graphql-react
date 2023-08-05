import { StartDto } from '../three-cards-monte/dto/start.dto';
import { CompleteDto } from '../three-cards-monte/dto/complete.dto';

export interface IGameService {
  init(userId: string): any;

  startGame(startGameInput: StartDto): any;

  completeGame(completeGameInput: CompleteDto): any;
}
