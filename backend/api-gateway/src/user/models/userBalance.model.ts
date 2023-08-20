import { Field, Float, ObjectType } from '@nestjs/graphql';

@ObjectType({ description: `User's balance` })
export class UserBalanceModel {
  @Field(() => Float)
  balance: number;
}
