import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class RegisterDto {
  @Field(() => String)
  email;
}
