import { Injectable, Logger } from '@nestjs/common';
import { UserDto } from './dto/user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';

@Injectable()
export class AppService {
  private readonly logger = new Logger('App Service');

  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async createUser(userDto: UserDto) {
    this.logger.log(`[${userDto.userId}]: Creating user profile`);
    const user = new this.userModel(userDto);

    const { _id } = await user.save();

    this.logger.log(`[${userDto.userId}]: User profile created`);

    return _id;
  }

  async deleteUser(userId: string) {
    return this.userModel.deleteOne({ userId });
  }
}
