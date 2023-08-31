import { Controller } from '@nestjs/common';
import { AppService } from './app.service';
import { MessagePattern } from '@nestjs/microservices';
import { UserDto } from './dto/user.dto';
import { Types } from 'mongoose';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @MessagePattern('user_create')
  createUserProfile(userDto: UserDto): Promise<Types.ObjectId> {
    return this.appService.createUser(userDto);
  }

  @MessagePattern('user_delete')
  deleteUserBalance(userId: string) {
    return this.appService.deleteUser(userId);
  }

  @MessagePattern('user_get')
  async getUser(user: { userId: string }) {
    return await this.appService.getUser(user.userId);
  }
}
