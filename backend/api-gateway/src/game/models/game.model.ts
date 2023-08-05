import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';

export enum Category {
  SLOT,
  TABLE,
  OTHER,
}

registerEnumType(Category, {
  name: 'Category',
});

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
