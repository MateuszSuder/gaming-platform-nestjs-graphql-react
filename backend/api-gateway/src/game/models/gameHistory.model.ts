import { Field, Float, ObjectType } from '@nestjs/graphql';

@ObjectType({ description: 'Top win type' })
class HistoryModel {
  @Field(() => String)
  game: string;

  @Field(() => Float)
  multiplier: number;

  @Field(() => Float)
  win: number;

  @Field(() => Float)
  bet: number;

  @Field(() => String)
  createdAt: string;
}

@ObjectType({ description: 'Top wins return type' })
export class GameHistoryModel {
  @Field(() => [HistoryModel])
  history: HistoryModel[];
}
