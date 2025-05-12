import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PaypalService {
  private readonly logger = new Logger(PaypalService.name);

  constructor(private configService: ConfigService) {
    if (!this.configService.get<string>('payment_gateway.paypal.clientId')) {
      this.logger.warn('PayPal not fully configured');
    }
  }
}
