import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Plinko, PlinkoSchema } from './schemas/plinko.schema';
import { ConfigModule } from '../config/config.module';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { PlinkoController } from './plinko.controller';
import { PlinkoService } from './plinko.service';

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
        name: Plinko.name,
        schema: PlinkoSchema,
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
  controllers: [PlinkoController],
  providers: [PlinkoService],
  exports: [PlinkoService],
})
export class PlinkoModule {}
