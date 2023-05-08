import { Controller, Logger } from '@nestjs/common';
import { AppService } from './app.service';
import { RegisterDto } from './dto/register.dto';
import { MessagePattern } from '@nestjs/microservices';

@Controller()
export class AppController {
  private readonly logger = new Logger('Controller');
  constructor(private readonly appService: AppService) {}

  @MessagePattern('auth_create')
  register(registerDto: RegisterDto) {
    this.logger.log(`Received register for user ${registerDto.email}`);
    return this.appService.createUser(registerDto);
  }
}
