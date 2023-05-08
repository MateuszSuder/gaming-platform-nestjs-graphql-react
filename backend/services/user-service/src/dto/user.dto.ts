import { IsMongoId, IsString } from 'class-validator';

export class UserDto {
  @IsMongoId()
  userId: string;

  @IsString()
  username: string;
}
