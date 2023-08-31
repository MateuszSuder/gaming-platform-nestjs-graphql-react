import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ThreeCardsMonteModule } from './three-cards-monte/three-cards-monte.module';
import { ConfigModule } from './config/config.module';
import { SevenFruitsModule } from './seven-fruits/seven-fruits.module';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { PlinkoModule } from './plinko/plinko.module';

@Module({
  imports: [
    ThreeCardsMonteModule,
    ConfigModule,
    SevenFruitsModule,
    PlinkoModule,
    ClientsModule.register([
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
            groupId: `user-consumer-game`,
          },
        },
      },
    ]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
