import { Controller, Logger } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { IGameController } from '../interfaces/game-controller';
import { ThreeCardsMonteService } from './three-cards-monte.service';
import { StartDto } from './dto/start.dto';
import { CompleteDto } from './dto/complete.dto';

@Controller()
export class ThreeCardsMonteController implements IGameController {
  private logger = new Logger('Three cards monte controller');

  constructor(
    private readonly threeCardsMonteService: ThreeCardsMonteService,
  ) {}

  @MessagePattern('monte_init')
  async init(userId: string) {
    this.logger.log(`Three cards monte init for user ${userId}`);
    return await this.threeCardsMonteService.init(userId);
  }

  @MessagePattern('monte_start')
  start(startGameInput: StartDto) {
    this.logger.log(`Three cards monte for user ${startGameInput.userId}`);
    return this.threeCardsMonteService.startGame(startGameInput);
  }

  @MessagePattern('monte_complete')
  complete(completeGameInput: CompleteDto) {
    return this.threeCardsMonteService.completeGame(completeGameInput);
  }
}
