import { IsEmail, IsStrongPassword } from 'class-validator';

export class RegisterDto {
  @IsEmail()
  email: string;

  @IsStrongPassword({ minLength: 8, minNumbers: 1, minSymbols: 1 })
  password: string;
}
