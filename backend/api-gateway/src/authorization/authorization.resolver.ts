import { Args, Context, Mutation, Query } from '@nestjs/graphql';
import { RegisterDto } from './dto/register.dto';
import { AuthorizationService } from './authorization.service';
import { TestModel } from './models/test.model';
import { UseFilters } from '@nestjs/common';
import ExceptionFilter from '../filters/exception.filter';
import { LoginDto } from './dto/login.dto';

@UseFilters(ExceptionFilter)
export class AuthorizationResolver {
  constructor(private readonly authorizationService: AuthorizationService) {}

  @Query(() => TestModel)
  test(): TestModel {
    return {
      id: '123',
      description: 'description',
      test: true,
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
        console.error(e);

        return e;
      }

      return true;
    }

    throw response;
  }
}
