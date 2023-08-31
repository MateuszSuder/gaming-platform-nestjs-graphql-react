import { Args, Context, Query, Resolver } from '@nestjs/graphql';
import { GameService } from './game.service';
import { GameModel } from './models/game.model';
import { CategoryModel } from './models/category.model';
import { TopWinsModel } from './models/topWins.model';
import { GameHistoryModel } from './models/gameHistory.model';
import { GameHistoryDto } from './dto/gameHistoryDto';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../guards/auth.guard';

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

  @Query(() => TopWinsModel)
  async topWins() {
    return this.gameService.topWins();
  }

  @UseGuards(AuthGuard)
  @Query(() => GameHistoryModel)
  async gameHistory(
    @Context() context: any,
    @Args('historyInput') historyInput: GameHistoryDto,
  ) {
    const { offset, limit } = historyInput;

    const userId = context.req?.userId;

    const history = await this.gameService.gameHistory(
      userId,
      historyInput.offset,
      historyInput.limit,
    );

    return {
      history: history.slice(offset, limit),
    };
  }
}
