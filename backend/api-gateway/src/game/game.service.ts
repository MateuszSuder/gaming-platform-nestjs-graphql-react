import { Injectable, Logger } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { GameListCommand } from './commands/impl/gameList.command';
import { CategoryListCommand } from './commands/impl/categoryList.command';
import { CategoryModel } from './models/category.model';
import { GameModel } from './models/game.model';

@Injectable()
export class GameService {
  private readonly logger = new Logger('Game service');
  constructor(private readonly commandBus: CommandBus) {}

  async gameList(): Promise<GameModel[]> {
    try {
      return this.commandBus.execute(new GameListCommand());
    } catch (e) {
      this.logger.error(e);
    }
  }

  async categoryList(): Promise<CategoryModel[]> {
    try {
      return this.commandBus.execute(new CategoryListCommand());
    } catch (e) {
      this.logger.error(e);
    }
  }
}
