import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SevenFruits, SevenFruitsSchema } from './schemas/seven-fruits.schema';
import { ConfigModule } from '../config/config.module';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { SevenFruitsController } from './seven-fruits.controller';
import { SevenFruitsService } from './seven-fruits.service';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://mongo-game:27017/', {
      auth: {
        username: process.env.MONGO_USERNAME,
        password: process.env.MONGO_PASSWORD,
      },
      dbName: 'game',
    }),
    MongooseModule.forFeature([
      {
        name: SevenFruits.name,
        schema: SevenFruitsSchema,
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
            groupId: `balance-consumer-fruits`,
          },
        },
      },
    ]),
  ],
  controllers: [SevenFruitsController],
  providers: [SevenFruitsService],
  exports: [SevenFruitsService],
})
export class SevenFruitsModule {}
