import { Controller } from '@nestjs/common';
import { AppService } from './app.service';
import { MessagePattern } from '@nestjs/microservices';
import { Types } from 'mongoose';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @MessagePattern('balance_create')
  createUserBalance(userId: string): Promise<Types.ObjectId> {
    return this.appService.createUserBalance(userId);
  }

  @MessagePattern('balance_delete')
  deleteUserBalance(userId: string) {
    return this.appService.deleteUserBalance(userId);
  }
}
