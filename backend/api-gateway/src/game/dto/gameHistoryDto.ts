import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class GameHistoryDto {
  @Field()
  limit: number;

  @Field()
  offset: number;
}
