import { IsMongoId, IsNumber, IsPositive } from 'class-validator';

export class StartDto {
  @IsMongoId()
  userId: string;

  @IsNumber()
  @IsPositive()
  bet: number;
}
