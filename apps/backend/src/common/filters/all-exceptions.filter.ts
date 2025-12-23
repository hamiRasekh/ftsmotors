import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let error = 'InternalServerError';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();
      
      if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
        const responseObj = exceptionResponse as any;
        message = responseObj.message || exception.message;
        error = exception.name;
      } else {
        message = exception.message || 'Internal server error';
        error = exception.name;
      }
    } else if (exception instanceof Error) {
      // Handle Prisma errors
      const errorMessage = exception.message;
      
      // Prisma error codes
      if (errorMessage.includes('P2002')) {
        status = HttpStatus.CONFLICT;
        message = 'Database constraint violation';
        error = 'Conflict';
      } else if (errorMessage.includes('P2025')) {
        status = HttpStatus.NOT_FOUND;
        message = 'Resource not found';
        error = 'NotFound';
      } else if (errorMessage.includes('P2003')) {
        status = HttpStatus.BAD_REQUEST;
        message = 'Foreign key constraint failed';
        error = 'BadRequest';
      } else if (errorMessage.includes('P2014')) {
        status = HttpStatus.BAD_REQUEST;
        message = 'Invalid ID provided';
        error = 'BadRequest';
      } else {
        message = errorMessage || 'Internal server error';
      }
    }

    // Log the error
    this.logger.error(
      `${request.method} ${request.url} - ${status} - ${message}`,
      exception instanceof Error ? exception.stack : String(exception),
    );

    // Send error response
    response.status(status).json({
      statusCode: status,
      error,
      message,
      ...(process.env.NODE_ENV !== 'production' && {
        timestamp: new Date().toISOString(),
        path: request.url,
      }),
    });
  }
}

