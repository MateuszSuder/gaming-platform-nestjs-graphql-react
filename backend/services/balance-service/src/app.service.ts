import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schemas/user.schema';

@Injectable()
export class AppService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async createUserBalance(userId: string) {
    const user = new this.userModel({
      userId,
    });

    const { _id } = await user.save();

    return _id;
  }
}
