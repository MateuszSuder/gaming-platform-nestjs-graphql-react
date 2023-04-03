import { Injectable } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AppService {
  register(registerDto: RegisterDto): string {
    return 'Register';
  }
}
