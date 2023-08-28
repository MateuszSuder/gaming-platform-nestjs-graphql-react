import { Module } from '@nestjs/common';
import { GameService } from './game.service';
import { GameResolver } from './game.resolver';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { CqrsModule } from '@nestjs/cqrs';
import { GameCommandHandlers } from './commands/handlers';
import { SevenFruitsModule } from './seven-fruits/seven-fruits.module';

@Module({
  controllers: [],
  providers: [GameResolver, GameService, ...GameCommandHandlers],
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
            groupId: `game-consumer-gateway`,
          },
        },
      },
    ]),
    SevenFruitsModule,
  ],
})
export class GameModule {}
