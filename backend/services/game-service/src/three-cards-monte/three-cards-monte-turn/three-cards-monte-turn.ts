import { GameHelpers } from '../../classes/game-helpers/game-helpers';

export class ThreeCardsMonteTurn {
  public multiplier = 0;
  drawnCard: number = null;
  private gameHelpers = new GameHelpers();

  constructor(cardNumber: number) {
    this.drawnCard = this.drawCard();

    if (cardNumber === this.drawnCard) this.multiplier = 2;
  }

  private drawCard(): number {
    return this.gameHelpers.generateRandomInteger(0, 2);
  }
}
