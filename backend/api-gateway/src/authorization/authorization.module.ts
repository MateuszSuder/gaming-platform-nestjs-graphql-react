import { Module } from '@nestjs/common';
import { AuthorizationService } from './authorization.service';
import { AuthorizationResolver } from './authorization.resolver';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { CqrsModule } from '@nestjs/cqrs';
import { CommandHandlers } from './commands/handlers';
import { VerifyHandler } from './commands/handlers/verify.handler';

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
            rebalanceTimeout: 1000,
            heartbeatInterval: 10000,
            sessionTimeout: 60000,
            groupId: `auth-consumer-gateway-auth`,
          },
        },
      },
      {
        name: 'USER_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'user',
            brokers: ['broker:29092'],
          },
          consumer: {
            rebalanceTimeout: 1000,
            heartbeatInterval: 10000,
            sessionTimeout: 60000,
            groupId: `user-consumer-gateway-auth`,
          },
        },
      },
      {
        name: 'BALANCE_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'balance',
            brokers: ['broker:29092'],
          },
          consumer: {
            rebalanceTimeout: 1000,
            heartbeatInterval: 10000,
            sessionTimeout: 60000,
            groupId: `balance-consumer-gateway-auth`,
          },
        },
      },
    ]),
    CqrsModule,
  ],
  providers: [AuthorizationResolver, AuthorizationService, ...CommandHandlers],
  exports: [VerifyHandler],
})
export class AuthorizationModule {}
