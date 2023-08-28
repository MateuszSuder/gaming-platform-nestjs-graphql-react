export interface IGameService {
  init(userId: string): any;

  startGame(startGameInput: any): any;

  completeGame(completeGameInput: any): any;
}
