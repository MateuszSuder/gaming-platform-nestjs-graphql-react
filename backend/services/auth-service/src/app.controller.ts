import { Controller } from '@nestjs/common';
import { AppService } from './app.service';
import { RegisterDto } from './dto/register.dto';
import { MessagePattern } from '@nestjs/microservices';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @MessagePattern('auth_register')
  register(registerDto: RegisterDto) {
    return this.appService.registerUser(registerDto);
  }
}
