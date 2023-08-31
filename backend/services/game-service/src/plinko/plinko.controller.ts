import { Controller, Logger } from '@nestjs/common';
import { IGameController } from '../interfaces/game-controller';
import { MessagePattern } from '@nestjs/microservices';
import { PlinkoService } from './plinko.service';
import { StartDto } from './dto/start.dto';
import { CompleteDto } from './dto/complete.dto';

@Controller('plinko')
export class PlinkoController implements IGameController {
  private logger = new Logger('Seven plinko controller');

  constructor(private readonly plinkoService: PlinkoService) {}

  @MessagePattern('plinko_init')
  init(userId: string) {
    return this.plinkoService.init(userId);
  }

  @MessagePattern('plinko_start')
  start(startDto: StartDto) {
    return this.plinkoService.startGame(startDto);
  }

  @MessagePattern('plinko_complete')
  complete(completeDto: CompleteDto) {
    return this.plinkoService.completeGame(completeDto);
  }
}
