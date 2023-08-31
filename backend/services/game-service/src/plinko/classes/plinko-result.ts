import {
  PlinkoDirection,
  PlinkoMultipliers,
} from '../../config/config.service';
import { GameHelpers } from '../../classes/game-helpers/game-helpers';

const rows = 8;

export class PlinkoResult {
  public win = 0;
  public multiplier = 0;
  public pattern: PlinkoDirection[] = [];

  private static multipliersPattern = [
    ...PlinkoMultipliers,
    ...PlinkoMultipliers.reverse().slice(1),
  ];

  private gameHelpers = new GameHelpers();
  private start() {
    let offset = 0;

    for (let i = 0; i < rows; i++) {
      const rand = this.gameHelpers.generateRandomInteger(0, 1);

      offset += rand;

      this.pattern.push(
        rand === 0 ? PlinkoDirection.Left : PlinkoDirection.Right,
      );
    }
    this.multiplier = PlinkoResult.multipliersPattern[offset];
    this.win = this.multiplier * this.bet;
  }
  constructor(public readonly bet: number) {
    this.start();
  }
}
