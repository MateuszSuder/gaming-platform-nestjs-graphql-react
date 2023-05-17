import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ConflictException,
  HttpException,
  HttpStatus,
  InternalServerErrorException,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { GqlExceptionFilter } from '@nestjs/graphql';

@Catch()
export default class ExceptionFilter implements GqlExceptionFilter {
  private readonly logger = new Logger('Exception filter');

  catch(exception: any, host: ArgumentsHost): any {
    this.logger.error(exception);
    let errorCode =
      exception.error?.status || exception.statusCode || exception.status;

    if (exception instanceof BadRequestException) errorCode = 400;

    switch (errorCode) {
      case 400:
        return new BadRequestException({ ...exception, statusCode: errorCode });
      case 401:
        return new UnauthorizedException({
          ...exception,
          statusCode: errorCode,
        });
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
