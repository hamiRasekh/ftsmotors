import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();

    // If exception response is an object with message and debug, include both
    if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
      const responseObj = exceptionResponse as any;
      
      response.status(status).json({
        statusCode: status,
        error: exception.name,
        message: responseObj.message || exception.message,
        ...(responseObj.debug && { debug: responseObj.debug }),
      });
    } else {
      // Standard exception response
      response.status(status).json({
        statusCode: status,
        error: exception.name,
        message: exception.message || 'Internal server error',
      });
    }
  }
}

