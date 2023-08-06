import { Query, Resolver } from '@nestjs/graphql';
import { GameService } from './game.service';
import { GameModel } from './models/game.model';
import { CategoryModel } from './models/category.model';

@Resolver()
export class GameResolver {
  constructor(private readonly gameService: GameService) {}
  @Query(() => [GameModel], { description: 'Returns list of games with ids' })
  gameList() {
    return this.gameService.gameList();
  }

  @Query(() => [CategoryModel], { description: 'Returns list of categories' })
  categoryList() {
    return this.gameService.categoryList();
  }
}
