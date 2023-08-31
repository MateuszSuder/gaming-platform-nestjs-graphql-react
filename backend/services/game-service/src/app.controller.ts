import { Controller, Logger } from '@nestjs/common';
import { AppService } from './app.service';
import { MessagePattern } from '@nestjs/microservices';
import { GameHistoryDto } from './dto/gameHistoryDto';

@Controller()
export class AppController {
  private logger = new Logger('Game controller');

  constructor(private readonly appService: AppService) {}

  @MessagePattern('game_list')
  gameList() {
    return this.appService.gameList();
  }

  @MessagePattern('category_list')
  categoryList() {
    return this.appService.categoryList();
  }

  @MessagePattern('top_wins')
  topWins() {
    return this.appService.topWins();
  }

  @MessagePattern('game_history')
  async gameHistory(gameHistoryInput: GameHistoryDto) {
    return await this.appService.gameHistory(gameHistoryInput);
  }
}
