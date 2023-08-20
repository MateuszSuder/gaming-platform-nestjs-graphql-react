import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/user.schema';
import { ClientsModule, Transport } from '@nestjs/microservices';

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
            groupId: `balance-consumer-gateway-auth`,
          },
        },
      },
    ]),
    MongooseModule.forRoot('mongodb://mongo-balance:27017', {
      auth: {
        username: process.env.MONGO_USERNAME,
        password: process.env.MONGO_PASSWORD,
      },
      dbName: 'balance',
    }),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
