import { IsMongoId, IsNumber, IsPositive, Max, Min } from 'class-validator';

export class StartDto {
  @IsMongoId()
  userId: string;

  @IsNumber()
  @IsPositive()
  @Min(1)
  @Max(3)
  cardNumber: number;

  @IsNumber()
  @IsPositive()
  bet: number;
}
