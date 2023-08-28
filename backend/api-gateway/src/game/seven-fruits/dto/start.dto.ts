import { InputType } from '@nestjs/graphql';
import { IsNumber, IsPositive } from 'class-validator';

@InputType()
export class StartDto {
  @IsNumber()
  @IsPositive()
  bet: number;
}
