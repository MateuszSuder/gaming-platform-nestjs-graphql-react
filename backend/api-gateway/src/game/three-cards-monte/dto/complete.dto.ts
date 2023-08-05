import { IsMongoId } from 'class-validator';

export class CompleteDto {
  @IsMongoId()
  gameId: string;
}
