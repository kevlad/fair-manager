import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { PaymentGatewaysController } from './payment-gateways.controller';
import { PaymentGatewaysService } from './payment-gateways.service';
import { StripeService } from './strategies/stripe.service';
import { PaypalService } from './strategies/paypal.service';
import { PaymentsModule } from '../payments/payments.module';
import { AuthModule } from '../auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BillingPaymentGatewayConfigEntity } from './entities/billing-payment-gateway-config.entity';

@Module({
  imports: [
    ConfigModule,
    HttpModule,
    AuthModule,
    PaymentsModule,
    TypeOrmModule.forFeature([BillingPaymentGatewayConfigEntity]),
  ],
  controllers: [PaymentGatewaysController],
  providers: [PaymentGatewaysService, StripeService, PaypalService],
  exports: [StripeService, PaypalService],
})
export class PaymentGatewaysModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // raw body middleware for Stripe can be added here
  }
}
