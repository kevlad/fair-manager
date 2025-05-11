import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';

interface ErrorResponse {
  statusCode: number;
  timestamp: string;
  path: string;
  method: string;
  correlationId?: string;
  error?: string;
  message: any;
  stack?: string;
}

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  constructor(
    private readonly httpAdapterHost: HttpAdapterHost,
    private readonly configService: ConfigService,
  ) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();
    const request = ctx.getRequest();
    const response = ctx.getResponse();

    const isDev = this.configService.get<string>('app.nodeEnv') === 'development';
    const correlationId = request.headers['x-correlation-id'] || request.correlationId;

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message: any = 'Internal server error';
    let errorName = 'InternalServerError';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const res = exception.getResponse();
      message = typeof res === 'string' ? res : (res as any).message || res;
      errorName = exception.constructor.name.replace('Exception', '') || exception.message;
    } else if (exception instanceof Error) {
      message = exception.message;
      errorName = exception.name;
      this.logger.error(exception.message, exception.stack, { correlationId });
    }

    const payload: ErrorResponse = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: httpAdapter.getRequestUrl(request),
      method: httpAdapter.getRequestMethod(request),
      correlationId,
      error: errorName,
      message,
    };

    if (isDev && exception instanceof Error && exception.stack) {
      payload.stack = exception.stack;
    }

    httpAdapter.reply(response, payload, status);
  }
}
