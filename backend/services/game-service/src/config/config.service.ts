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

export interface IBaseConfig {
  bets: number[];
}

export interface IPayout {
  quantity: number;
  multiplier: number;
}

export interface ISlotSymbol {
  name: string;
  payouts: Array<IPayout>;
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
    ];
  }
  getThreeCardsMonteConfig(): IBaseConfig {
    return {
      bets: [1, 2, 4, 5, 10, 15, 20, 25, 50, 100],
    };
  }
}
