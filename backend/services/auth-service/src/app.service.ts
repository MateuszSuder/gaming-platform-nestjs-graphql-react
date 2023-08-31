import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { Model, Types } from 'mongoose';
import { RegisterDto } from './dto/register.dto';
import { User, UserDocument } from './schemas/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import * as argon2 from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class AppService {
  private readonly logger = new Logger('App Service');

  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private jwtService: JwtService,
  ) {}

  async createUser(registerDto: RegisterDto): Promise<Types.ObjectId> {
    this.logger.log(`[]: Creating user`);
    const { password } = registerDto;

    const hashedPassword = await argon2.hash(
      `${password}${process.env.PEPPER}`,
    );

    this.logger.log(`[]: Password hashed`);

    const user = new this.userModel({
      ...registerDto,
      password: hashedPassword,
    });

    const { _id } = await user.save();

    this.logger.log(`[${_id}]: User created`);

    return _id;
  }

  async deleteUser(userId: string) {
    return this.userModel.deleteOne({ _id: userId });
  }

  async login({ email, password: userPassword }) {
    this.logger.log(`[]: User login`);
    const user: UserDocument = await this.userModel.findOne(
      { email },
      { password: 1 },
    );

    if (!user) {
      this.logger.log(`[]: User incorrect credentials [1]`);
      throw new RpcException(
        new UnauthorizedException('Incorrect email or password'),
      );
    }
    if (
      await argon2.verify(user.password, `${userPassword}${process.env.PEPPER}`)
    ) {
      const payload = { id: user._id, email: user.email };

      this.logger.log(`[${user._id}]: User logged in`);

      return {
        access_token: await this.jwtService.signAsync(payload),
      };
    } else {
      this.logger.log(`[]: User incorrect credentials [2]`);
      throw new RpcException(
        new UnauthorizedException('Incorrect email or password'),
      );
    }
  }

  async verifyToken(token: string) {
    try {
      return this.jwtService.verify(token);
    } catch (e) {
      throw new RpcException(new UnauthorizedException('Unauthorized'));
    }
  }
}
