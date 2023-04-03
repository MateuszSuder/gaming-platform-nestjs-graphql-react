import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType({ description: 'register' })
export class Register {
  @Field((type) => String)
  email: string;
}
