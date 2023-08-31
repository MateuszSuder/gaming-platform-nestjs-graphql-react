import { Injectable } from '@nestjs/common';

export enum Category {
  SLOT,
  TABLE,
  OTHER,
}

const categoryToLabelMap: Record<Category, string> = {
  [Category.SLOT]: 'Slot machines',
  [Category.TABLE]: 'Table games',
  [Category.OTHER]: 'Other',
};

export enum FruitsSlotSymbol {
  SEVEN = '7',
  WATERMELON = 'Watermelon',
  STRAWBERRY = 'Strawberry',
  PINEAPPLE = 'Pineapple',
  GRAPE = 'Grape',
  APPLE = 'Apple',
  BANANA = 'Banana',
}

export enum PlinkoDirection {
  Left = 'LEFT',
  Right = 'RIGHT',
}

export const FruitsSlotSymbolPayouts: Record<
  FruitsSlotSymbol,
  Pick<ISlotSymbol, 'payouts' | 'chance'>
> = {
  [FruitsSlotSymbol.SEVEN]: {
    chance: 0.05,
    payouts: [
      {
        quantity: 3,
        multiplier: 150,
      },
    ],
  },
  [FruitsSlotSymbol.WATERMELON]: {
    chance: 0.07,
    payouts: [
      {
        quantity: 3,
        multiplier: 50,
      },
    ],
  },
  [FruitsSlotSymbol.STRAWBERRY]: {
    chance: 0.1,
    payouts: [
      {
        quantity: 3,
        multiplier: 30,
      },
    ],
  },
  [FruitsSlotSymbol.PINEAPPLE]: {
    chance: 0.13,
    payouts: [
      {
        quantity: 3,
        multiplier: 20,
      },
    ],
  },
  [FruitsSlotSymbol.GRAPE]: {
    chance: 0.15,
    payouts: [
      {
        quantity: 3,
        multiplier: 7.5,
      },
    ],
  },
  [FruitsSlotSymbol.APPLE]: {
    chance: 0.2,
    payouts: [
      {
        quantity: 3,
        multiplier: 2.5,
      },
    ],
  },
  [FruitsSlotSymbol.BANANA]: {
    chance: 0.3,
    payouts: [
      {
        quantity: 3,
        multiplier: 1,
      },
    ],
  },
};

export const PlinkoMultipliers = [13, 3, 1.3, 0.7, 0.4];

export interface IBaseConfig {
  bets: number[];
}

export interface IPlinkoConfig extends IBaseConfig {
  multipliers: number[];
}

export interface IPayout {
  quantity: number;
  multiplier: number;
}

export interface ISlotSymbol {
  name: string;
  payouts: Array<IPayout>;
  chance: number;
}

export interface ISlotConfig extends IBaseConfig {
  symbols: Array<ISlotSymbol>;
}

export interface IGameEntity {
  id: number;
  name: string;
  category: Category;
}

export interface CategoryEntity {
  id: Category | string;
  label: string;
}

@Injectable()
export class ConfigService {
  getCategories(): CategoryEntity[] {
    return Object.values(Category)
      .filter(Number.isInteger)
      .map((id) => ({
        id,
        label: categoryToLabelMap[id],
      }));
  }

  getGameList(): IGameEntity[] {
    return [
      {
        id: 1,
        name: 'Three-card monte',
        category: Category.TABLE,
      },
      {
        id: 2,
        name: '777 Fruits',
        category: Category.SLOT,
      },
      {
        id: 3,
        name: 'Plinko',
        category: Category.OTHER,
      },
    ];
  }
  getThreeCardsMonteConfig(): IBaseConfig {
    return {
      bets: [1, 2, 4, 5, 10, 15, 20, 25, 50, 100],
    };
  }

  getFruitsSymbols(): ISlotSymbol[] {
    return Object.entries(FruitsSlotSymbolPayouts).map(
      ([symbol, { payouts, chance }]) => ({
        name: symbol,
        payouts,
        chance,
      }),
    );
  }

  getFruitsConfig(): ISlotConfig {
    return {
      bets: [1, 2, 4, 5, 10, 15, 20, 25, 50, 100],
      symbols: this.getFruitsSymbols(),
    };
  }

  getPlinkoConfig(): IPlinkoConfig {
    return {
      bets: [1, 2, 4, 5, 10, 15, 20, 25, 50, 100],
      multipliers: PlinkoMultipliers,
    };
  }
}
