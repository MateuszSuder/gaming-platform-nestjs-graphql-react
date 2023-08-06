import { Field, Float, ObjectType } from '@nestjs/graphql';

@ObjectType({ description: 'User return type' })
export class UserModel {
  @Field(() => String)
  _id: string;

  @Field(() => String)
  username: string;

  @Field(() => Float)
  balance: number;
}
