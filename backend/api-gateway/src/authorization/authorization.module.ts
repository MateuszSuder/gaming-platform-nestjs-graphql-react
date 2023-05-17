import { Module } from '@nestjs/common';
import { AuthorizationService } from './authorization.service';
import { AuthorizationResolver } from './authorization.resolver';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { CqrsModule } from '@nestjs/cqrs';
import { CommandHandlers } from './commands/handlers';

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
            groupId: `auth-consumer`,
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
            groupId: `user-consumer`,
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
            groupId: `balance-consumer`,
          },
        },
      },
    ]),
    CqrsModule,
  ],
  providers: [AuthorizationResolver, AuthorizationService, ...CommandHandlers],
})
export class AuthorizationModule {}
