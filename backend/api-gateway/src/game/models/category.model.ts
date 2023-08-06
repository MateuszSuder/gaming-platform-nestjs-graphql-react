import { Field, ObjectType } from '@nestjs/graphql';
import { Category } from '../enums/category.enum';

export interface CategoryEntity {
  id: Category | number;
  label: string;
}

@ObjectType()
export class CategoryModel implements CategoryEntity {
  @Field(() => Category)
  id: Category;

  @Field(() => String)
  label: string;
}
