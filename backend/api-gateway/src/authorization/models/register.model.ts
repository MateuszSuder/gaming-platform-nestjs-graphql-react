import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType({ description: 'Register return type' })
export class Register {
  @Field((type) => String)
  _id: string;
}
