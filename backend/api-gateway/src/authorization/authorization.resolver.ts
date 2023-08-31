import { Args, Context, Mutation, Query } from '@nestjs/graphql';
import { RegisterDto } from './dto/register.dto';
import { AuthorizationService } from './authorization.service';
import { UseFilters, UseGuards } from '@nestjs/common';
import ExceptionFilter from '../filters/exception.filter';
import { LoginDto } from './dto/login.dto';
import { UserModel } from './models/user.model';
import { AuthGuard } from '../guards/auth.guard';

@UseFilters(ExceptionFilter)
export class AuthorizationResolver {
  constructor(private readonly authorizationService: AuthorizationService) {}

  @UseGuards(AuthGuard)
  @Query(() => UserModel)
  async user(@Context() context: any): Promise<UserModel> {
    const userId = context.req?.userId;

    const user = await this.authorizationService.getUser(userId);

    return {
      _id: context.req.userId,
      balance: user.balance,
      username: user.username,
    };
  }

  @Mutation(() => String, { description: 'Register mutation' })
  register(@Args('registerData') userData: RegisterDto) {
    return this.authorizationService.createUser(userData);
  }

  @Mutation(() => Boolean, { description: 'Login mutation' })
  async login(@Context() context: any, @Args('login') userData: LoginDto) {
    const response = await this.authorizationService.login(userData);

    if (response && response.access_token) {
      try {
        context.rep.setCookie('token', response.access_token);
      } catch (e) {
        return e;
      }

      return true;
    }

    throw response;
  }
}
