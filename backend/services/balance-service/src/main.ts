import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  MicroserviceOptions,
  RpcException,
  Transport,
} from '@nestjs/microservices';
import { MongoFilter } from './filters/mongo.filter';
import { HttpStatus, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.KAFKA,
      options: {
        client: {
          brokers: ['broker:29092'],
        },
        consumer: {
          rebalanceTimeout: 1000,
          groupId: 'balance-consumer',
        },
      },
    },
  );

  app.useGlobalPipes(
    new ValidationPipe({
      transform: false,
      whitelist: true,
      forbidNonWhitelisted: true,
      forbidUnknownValues: true,
      disableErrorMessages: false,
      errorHttpStatusCode: 400,
      exceptionFactory: (errors) => {
        return new RpcException({ errors, statusCode: HttpStatus.BAD_REQUEST });
      },
    }),
  );

  app.useGlobalFilters(new MongoFilter());

  await app.listen();
}

bootstrap();
