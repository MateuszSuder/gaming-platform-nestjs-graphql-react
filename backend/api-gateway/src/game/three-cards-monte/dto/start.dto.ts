import { InputType } from '@nestjs/graphql';
import { IsNumber, IsPositive, Max, Min } from 'class-validator';

@InputType()
export class StartDto {
  @IsNumber()
  @IsPositive()
  bet: number;

  @IsNumber({ maxDecimalPlaces: 0 })
  @Min(0)
  @Max(2)
  cardNumber: number;
}
