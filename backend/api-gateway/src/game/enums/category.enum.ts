import { registerEnumType } from '@nestjs/graphql';

export enum Category {
  SLOT,
  TABLE,
  OTHER,
}

registerEnumType(Category, {
  name: 'Category',
});
