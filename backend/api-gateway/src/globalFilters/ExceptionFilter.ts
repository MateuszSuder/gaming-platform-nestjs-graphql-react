import {ArgumentsHost, BadRequestException, Catch} from '@nestjs/common';
import {GqlExceptionFilter} from '@nestjs/graphql';

@Catch()
export default class ExceptionFilter implements GqlExceptionFilter {
  catch(exception: any, host: ArgumentsHost): any {
    return new BadRequestException(exception)
  }
}
