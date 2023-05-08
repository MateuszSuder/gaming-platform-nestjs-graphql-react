import { Injectable } from '@nestjs/common';
import { Model, ObjectId, Types } from 'mongoose';
import { RegisterDto } from './dto/register.dto';
import { User } from './schemas/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import * as argon2 from 'argon2';

@Injectable()
export class AppService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async createUser(registerDto: RegisterDto): Promise<Types.ObjectId> {
    const { password } = registerDto;

    const hashedPassword = await argon2.hash(
      `${password}${process.env.PEPPER}`,
    );
    const user = new this.userModel({
      ...registerDto,
      password: hashedPassword,
    });

    const { _id } = await user.save();

    return _id;
  }

  removeUser(userId: ObjectId) {
    return 'Remove user';
  }
}
