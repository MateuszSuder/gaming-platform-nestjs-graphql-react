import { Injectable } from '@nestjs/common';
import { Model, ObjectId } from 'mongoose';
import { RegisterDto } from './dto/register.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';

@Injectable()
export class AppService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async registerUser(registerDto: RegisterDto): Promise<string> {
    await this.userModel.create({
      email: 'test@gmail.com',
      password: 'test123',
    });
    return 'Register';
  }

  removeUser(userId: ObjectId) {
    return 'Remove user';
  }
}
