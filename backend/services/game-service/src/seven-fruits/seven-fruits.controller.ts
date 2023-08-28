import { Controller, Logger } from '@nestjs/common';
import { IGameController } from '../interfaces/game-controller';
import { MessagePattern } from '@nestjs/microservices';
import { SevenFruitsService } from './seven-fruits.service';
import { StartDto } from './dto/start.dto';
import { CompleteDto } from './dto/complete.dto';

@Controller('seven-fruits')
export class SevenFruitsController implements IGameController {
  private logger = new Logger('Seven fruits controller');

  constructor(private readonly sevenFruitsService: SevenFruitsService) {}

  @MessagePattern('fruits_init')
  init(userId: string) {
    return this.sevenFruitsService.init(userId);
  }

  @MessagePattern('fruits_start')
  start(startDto: StartDto) {
    return this.sevenFruitsService.startGame(startDto);
  }

  @MessagePattern('fruits_complete')
  complete(completeDto: CompleteDto) {
    return this.sevenFruitsService.completeGame(completeDto);
  }
}
