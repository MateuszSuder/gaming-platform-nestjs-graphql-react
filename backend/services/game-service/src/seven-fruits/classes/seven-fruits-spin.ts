import { GameHelpers } from '../../classes/game-helpers/game-helpers';
import {
  FruitsSlotSymbol,
  FruitsSlotSymbolPayouts,
} from '../../config/config.service';

interface SymbolRange {
  min: number;
  max: number;
  symbol: FruitsSlotSymbol;
}

export class SevenFruitsSpin {
  private readonly lines = [
    [
      [0, 0],
      [0, 1],
      [0, 2],
    ],
    [
      [1, 0],
      [1, 1],
      [1, 2],
    ],
    [
      [2, 0],
      [2, 1],
      [2, 2],
    ],
    [
      [0, 0],
      [1, 1],
      [2, 2],
    ],
    [
      [2, 0],
      [1, 1],
      [0, 2],
    ],
  ];
  private helpers = new GameHelpers();

  private static readonly symbolsRange: SymbolRange[] = Object.entries(
    FruitsSlotSymbolPayouts,
  ).reduce<SymbolRange[]>((acc, [symbol, payout], i) => {
    if (i === 0) {
      return [
        {
          min: 1,
          max: payout.chance * 100,
          symbol: symbol as FruitsSlotSymbol,
        },
      ];
    } else {
      const min = acc[i - 1].max + 1;
      const max = min + (payout.chance * 100 - 1);

      return [
        ...acc,
        {
          min,
          max,
          symbol: symbol as FruitsSlotSymbol,
        },
      ];
    }
  }, []);

  private getRandomSymbol(): FruitsSlotSymbol {
    const n = this.helpers.generateRandomInteger(1, 100);

    const symbol = SevenFruitsSpin.symbolsRange.find((s) => {
      return s.min <= n && s.max >= n;
    });

    return symbol.symbol;
  }

  private spin() {
    for (let i = 0; i < 3; i++) {
      this.symbols.push([]);
      for (let j = 0; j < 3; j++) {
        this.symbols[i].push(this.getRandomSymbol());
      }
    }

    for (const line of this.lines) {
      const symbolsInLine: FruitsSlotSymbol[] = [];
      for (const [x, y] of line) {
        symbolsInLine.push(this.symbols[x][y]);
      }

      const firstSymbol = symbolsInLine[0];
      const sameSymbols = symbolsInLine.filter((s) => s === firstSymbol);

      if (sameSymbols.length === 3) {
        this.multiplier +=
          FruitsSlotSymbolPayouts[firstSymbol].payouts[0].multiplier;
        this.win += this.bet * this.multiplier;
        this.winningLines.push(line);
      }
    }
  }

  public win = 0;
  public multiplier = 0;
  public symbols: FruitsSlotSymbol[][] = [];
  public winningLines: number[][][] = [];

  constructor(public readonly bet: number) {
    this.spin();
  }
}
