import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ConflictException,
  HttpException,
  HttpStatus,
  InternalServerErrorException,
} from '@nestjs/common';
import { GqlExceptionFilter } from '@nestjs/graphql';

@Catch()
export default class ExceptionFilter implements GqlExceptionFilter {
  catch(exception: any, host: ArgumentsHost): any {
    console.log(exception);
    const errorCode = exception.error?.status || exception.statusCode;

    switch (errorCode) {
      case 400:
        return new BadRequestException({ ...exception, statusCode: errorCode });
      case 409:
        return new ConflictException({ ...exception, statusCode: errorCode });
      default:
      case 500:
        throw new InternalServerErrorException({
          ...exception,
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        });
    }

    return new HttpException(
      {
        message: exception,
        statusCode: exception.error?.statusCode || exception.statusCode,
      },
      HttpStatus.CONFLICT,
    );
  }
}
