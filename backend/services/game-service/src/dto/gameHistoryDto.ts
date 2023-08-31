import { IsInt, IsMongoId, IsNumber, Min } from 'class-validator';

export class GameHistoryDto {
  @IsMongoId()
  userId: string;

  @IsNumber()
  @IsInt()
  @Min(0)
  offset: number;

  @IsNumber()
  @IsInt()
  @Min(0)
  limit: number;
}
