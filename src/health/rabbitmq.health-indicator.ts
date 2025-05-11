import { Injectable } from '@nestjs/common';
import { HealthIndicator, HealthIndicatorResult, HealthCheckError } from '@nestjs/terminus';
import { RabbitMQService } from '../../infrastructure/message-queue/rabbitmq.service';

@Injectable()
export class RabbitMQHealthIndicator extends HealthIndicator {
  constructor(private readonly rabbit: RabbitMQService) { super(); }
  async isHealthy(key: string): Promise<HealthIndicatorResult> {
    if (this.rabbit.isConnected()) {
      return this.getStatus(key, true);
    }
    throw new HealthCheckError('RabbitMQ not connected', this.getStatus(key, false));
  }
}
