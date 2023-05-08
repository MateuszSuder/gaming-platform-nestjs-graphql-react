import {
  BadRequestException,
  Catch,
  ConflictException,
  ExceptionFilter,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { mongo } from 'mongoose';
import { RpcException } from '@nestjs/microservices';

@Catch(mongo.MongoServerError)
export class MongoFilter implements ExceptionFilter {
  private readonly logger = new Logger('Exception Filter');
  catch(exception: mongo.MongoServerError): any {
    this.logger.error(exception);

    const code = exception.code;

    let resultException = null;
    switch (code) {
      case 11000:
        const { keyValue } = exception;
        const [key, value] = Object.entries(keyValue)[0];
        resultException = new ConflictException({
          message: `${key} with value ${value} already exists`,
          statusCode: InternalServerErrorException,
        });
        break;
      default:
        resultException = new BadRequestException(exception);
        break;
    }
    throw new RpcException({ ...resultException });
  }
}
