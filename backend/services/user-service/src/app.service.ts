import { Injectable } from '@nestjs/common';
import { UserDto } from './dto/user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';

@Injectable()
export class AppService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async createUser(userDto: UserDto) {
    console.log('creating user');
    const user = new this.userModel(userDto);

    const { _id } = await user.save();

    return _id;
  }
  getHello(): string {
    return 'Hello World!';
  }
}
