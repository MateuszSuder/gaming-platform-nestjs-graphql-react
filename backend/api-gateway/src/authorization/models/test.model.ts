import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType({ description: 'test ' })
export class TestModel {
  @Field(() => ID)
  id: string;

  @Field()
  description: string;

  @Field({ nullable: true })
  test: boolean;
}
