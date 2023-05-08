import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class RegisterDto {
  @Field(() => String)
  email: string;

  @Field(() => String)
  password: string;

  @Field(() => String)
  username: string;
}
