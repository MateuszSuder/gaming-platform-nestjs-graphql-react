import {Field, Float, ObjectType} from '@nestjs/graphql';

@ObjectType({ description: 'Top win type' })
class TopWinModel {
  @Field(() => String)
  username: string;

  @Field(() => String)
  game: string;

  @Field(() => Float)
  multiplier: number;

  @Field(() => Float)
  win: number;
}

@ObjectType({ description: 'Top wins return type' })
export class TopWinsModel {
  @Field(() => [TopWinModel])
  topWins: TopWinModel[];

  @Field(() => [TopWinModel])
  topMultipliers: TopWinModel[];
}
