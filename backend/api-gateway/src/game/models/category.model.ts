import { Field, ObjectType } from '@nestjs/graphql';

export enum Category {
  SLOT,
  TABLE,
  OTHER,
}

export interface CategoryEntity {
  id: Category | number;
  label: string;
}

@ObjectType()
export class CategoryModel implements CategoryEntity {
  @Field()
  id: number;

  @Field()
  label: string;
}
