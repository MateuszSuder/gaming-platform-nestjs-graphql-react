import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { SevenFruitsGateway } from './seven-fruits.gateway';
import { CommandHandlers } from './commands/handlers';

@Module({
  providers: [SevenFruitsGateway, ...CommandHandlers],
  imports: [
    CqrsModule,
    ClientsModule.register([
      {
        name: 'GAME_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'game',
            brokers: ['broker:29092'],
          },
          consumer: {
            rebalanceTimeout: 1000,
            groupId: `game-consumer-gateway-sf`,
          },
        },
      },
    ]),
  ],
})
export class SevenFruitsModule {}
