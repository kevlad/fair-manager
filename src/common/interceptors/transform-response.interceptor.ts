import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface StandardResponse<T> {
  statusCode: number;
  message?: string;
  data: T;
  timestamp: string;
  path: string;
  method: string;
  correlationId?: string;
}

@Injectable()
export class TransformResponseInterceptor<T> implements NestInterceptor<T, StandardResponse<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<StandardResponse<T>> {
    const request = context.switchToHttp().getRequest();
    const correlationId = request.headers['x-correlation-id'] || request.correlationId;
    return next.handle().pipe(
      map((data) => {
        const response = context.switchToHttp().getResponse();
        return {
          statusCode: response.statusCode,
          message: 'Success',
          data,
          timestamp: new Date().toISOString(),
          path: request.url,
          method: request.method,
          correlationId,
        };
      }),
    );
  }
}
