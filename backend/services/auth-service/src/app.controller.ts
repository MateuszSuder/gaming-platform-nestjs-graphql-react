import { Controller, Logger } from '@nestjs/common';
import { AppService } from './app.service';
import { RegisterDto } from './dto/register.dto';
import { MessagePattern } from '@nestjs/microservices';
import { LoginDto } from './dto/login.dto';

@Controller()
export class AppController {
  private readonly logger = new Logger('Controller');
  constructor(private readonly appService: AppService) {}

  @MessagePattern('auth_create')
  register(registerDto: RegisterDto) {
    this.logger.log(`Received register for user ${registerDto.email}`);
    return this.appService.createUser(registerDto);
  }

  @MessagePattern('auth_delete')
  unregister(userId: string) {
    this.logger.log(`Received unregister for user id ${userId}`);
    return this.appService.deleteUser(userId);
  }

  @MessagePattern('auth_login')
  login(credentials: LoginDto) {
    this.logger.log(`Received login`);
    return this.appService.login(credentials);
  }

  @MessagePattern('auth_verify')
  verifyToken(token: string) {
    this.logger.log('Received token verify');
    return this.appService.verifyToken(token);
  }
}
