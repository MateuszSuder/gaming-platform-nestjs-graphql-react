import { Field, ObjectType } from '@nestjs/graphql';
import { Category } from '../enums/category.enum';

export interface IGameEntity {
  id: number;
  name: string;
  category: Category;
}

@ObjectType()
export class GameModel implements IGameEntity {
  @Field((type) => Number)
  id: number;

  @Field((type) => String)
  name: string;

  @Field((type) => Category)
  category: Category;
}
