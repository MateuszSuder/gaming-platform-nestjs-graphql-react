import { Module } from '@nestjs/common';
import { AuthorizationService } from './authorization.service';
import { AuthorizationResolver } from './authorization.resolver';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'AUTH_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'auth',
            brokers: ['broker:29092'],
          },
          consumer: {
            groupId: 'auth-consumer',
          },
        },
      },
    ]),
  ],
  providers: [AuthorizationResolver, AuthorizationService],
})
export class AuthorizationModule {}
