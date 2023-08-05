import { IsMongoId } from 'class-validator';

export class CompleteDto {
  @IsMongoId()
  userId: string;

  @IsMongoId()
  gameId: string;
}
