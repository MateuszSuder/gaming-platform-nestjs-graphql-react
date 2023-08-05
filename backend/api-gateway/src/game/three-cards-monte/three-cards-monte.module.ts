import { Module } from '@nestjs/common';
import { ThreeCardsMonteGateway } from './three-cards-monte.gateway';
import { CqrsModule } from '@nestjs/cqrs';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { CommandHandlers } from './commands/handlers';

@Module({
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
            groupId: `game-tcm-consumer`,
          },
        },
      },
    ]),
  ],
  providers: [ThreeCardsMonteGateway, ...CommandHandlers],
})
export class ThreeCardsMonteModule {}
