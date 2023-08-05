import { Module } from '@nestjs/common';
import { ThreeCardsMonteController } from './three-cards-monte.controller';
import { ThreeCardsMonteService } from './three-cards-monte.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '../config/config.module';
import {
  ThreeCardsMonte,
  ThreeCardsMonteSchema,
} from './schemas/three-cards-monte.schema';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://mongo-game:27017', {
      auth: {
        username: process.env.MONGO_USERNAME,
        password: process.env.MONGO_PASSWORD,
      },
      dbName: 'three-cards-monte',
    }),
    MongooseModule.forFeature([
      {
        name: ThreeCardsMonte.name,
        schema: ThreeCardsMonteSchema,
      },
    ]),
    ConfigModule,
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
            groupId: `balance-consumer`,
          },
        },
      },
    ]),
  ],
  controllers: [ThreeCardsMonteController],
  providers: [ThreeCardsMonteService],
})
export class ThreeCardsMonteModule {}
