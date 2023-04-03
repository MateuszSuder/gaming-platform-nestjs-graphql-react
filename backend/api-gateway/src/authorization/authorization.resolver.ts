import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Register } from './models/register.model';
import { RegisterDto } from './dto/register.dto';
import { AuthorizationService } from './authorization.service';
import { TestModel } from './models/test.model';
import { UseFilters } from '@nestjs/common';
import ExceptionFilter from '../globalFilters/ExceptionFilter';

@UseFilters(ExceptionFilter)
@Resolver(() => Register)
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

  @Mutation(() => String)
  register(@Args('registerData') userData: RegisterDto) {
    return this.authorizationService.createUser(userData);
  }
}
