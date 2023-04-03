import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { RegisterDto } from './dto/register.dto';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AuthorizationService implements OnModuleInit {
  constructor(
    @Inject('AUTH_SERVICE') private readonly authClient: ClientKafka,
  ) {}

  async onModuleInit() {
    this.authClient.subscribeToResponseOf('auth_register');
    await this.authClient.connect();
  }

  async createUser(userData: RegisterDto) {
    return await firstValueFrom(
      this.authClient.send('auth_register', JSON.stringify(userData)),
    );
  }
}
