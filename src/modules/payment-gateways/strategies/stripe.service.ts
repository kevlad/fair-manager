import { Injectable, Logger, BadRequestException, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';

@Injectable()
export class StripeService {
  private readonly stripe: Stripe;
  private readonly logger = new Logger(StripeService.name);
  private readonly webhookSecret: string;

  constructor(configService: ConfigService) {
    const apiKey = configService.get<string>('payment_gateway.stripe.apiKey');
    this.webhookSecret = configService.get<string>('payment_gateway.stripe.webhookSecret');
    if (!apiKey || !this.webhookSecret) {
      throw new Error('Stripe configuration missing');
    }
    this.stripe = new Stripe(apiKey, { apiVersion: '2023-10-16', typescript: true });
  }

  constructEvent(payload: Buffer, signature: string): Stripe.Event {
    try {
      return this.stripe.webhooks.constructEvent(payload, signature, this.webhookSecret);
    } catch (err) {
      throw new BadRequestException(`Webhook verification failed: ${err.message}`);
    }
  }

  async retrievePaymentIntent(id: string): Promise<Stripe.PaymentIntent> {
    try {
      const pi = await this.stripe.paymentIntents.retrieve(id, { expand: ['latest_charge'] });
      return pi;
    } catch (err) {
      this.logger.error(err.message, err.stack);
      if (err instanceof Stripe.errors.StripeError && err.code === 'resource_missing') {
        throw new NotFoundException('PaymentIntent not found');
      }
      throw new InternalServerErrorException();
    }
  }
}
