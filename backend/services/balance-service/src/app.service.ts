import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schemas/user.schema';

@Injectable()
export class AppService {
  private readonly logger = new Logger('App Service');

  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async createUserBalance(userId: string) {
    this.logger.log(`[${userId}]: Creating user balance`);
    const user = new this.userModel({
      userId,
    });

    const { _id } = await user.save();

    this.logger.log(`[${userId}]: User balance created`);

    return _id;
  }

  async deleteUserBalance(userId: string) {
    return this.userModel.deleteOne({ userId });
  }

  async addUserBalance(addBalanceInput: { userId: string; toAdd: number }) {
    const { userId, toAdd } = addBalanceInput;
    const userModel = await this.userModel.findOneAndUpdate(
      { userId },
      {
        $inc: { balance: toAdd },
      },
      { returnDocument: 'after', new: true },
    );

    return { balance: userModel.balance };
  }

  async getUserBalance(userId: string) {
    return { balance: (await this.userModel.findOne({ userId })).balance };
  }
}
