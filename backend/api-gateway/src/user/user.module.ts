import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { CqrsModule } from '@nestjs/cqrs';
import { UserService } from './user.service';
import { UserResolver } from './user.resolver';

@Module({
  imports: [
    ClientsModule.register([
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
            groupId: `balance-consumer-gateway-balance`,
          },
        },
      },
    ]),
    CqrsModule,
  ],
  providers: [UserService, UserResolver],
})
export class UserModule {}
