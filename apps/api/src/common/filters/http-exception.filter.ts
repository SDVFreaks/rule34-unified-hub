import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger('GlobalExceptionFilter');

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const res = exception.getResponse();
      message =
        typeof res === 'object' && res !== null && 'message' in res
          ? String((res as Record<string, any>).message)
          : JSON.stringify(res);
    } else if (exception instanceof Error) {
      message = exception.message;
      // Special handling for Prisma connection errors
      if (
        message.includes("Can't reach database server") ||
        message.includes('PrismaClientInitializationError') ||
        message.includes('ECONNREFUSED')
      ) {
        if (request.url.includes('/posts')) {
          const { dummyPosts } = require('../../common/constants/dummy-data');
          return response.status(200).json({
            status: 'db-offline',
            message: 'Database is unreachable. Showing dummy data.',
            data: { posts: dummyPosts, total: dummyPosts.length },
          });
        }

        return response.status(503).json({
          status: 'db-offline',
          message: 'Database connection failed.',
        });
      }
    }

    this.logger.error(
      `${request.method} ${request.url} ${status} - Error: ${message}`,
      exception instanceof Error ? exception.stack : undefined,
    );

    response.status(status).json({
      status: 'error',
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message:
        status === HttpStatus.INTERNAL_SERVER_ERROR
          ? 'A serious error occurred. Our team has been notified.'
          : message,
    });
  }
}
