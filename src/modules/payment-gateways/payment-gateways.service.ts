import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { StripeService } from './strategies/stripe.service';
import { PaypalService } from './strategies/paypal.service';
import { PaymentsService } from '../payments/payments.service';
import { BillingPaymentStatus } from '../payments/entities/billing-payment.entity';
import Stripe from 'stripe';

@Injectable()
export class PaymentGatewaysService {
  private readonly logger = new Logger(PaymentGatewaysService.name);
  constructor(
    private readonly stripeService: StripeService,
    private readonly paypalService: PaypalService,
    private readonly paymentsService: PaymentsService,
  ) {}

  async processStripeEvent(event: Stripe.Event): Promise<void> {
    this.logger.log(`Stripe event type ${event.type}`);
    if (event.type === 'invoice.payment_succeeded') {
      const invoice = event.data.object as Stripe.Invoice;
      const tenantId = invoice.metadata?.bsa_tenant_id;
      const invoiceId = invoice.metadata?.bsa_invoice_id;
      const paymentIntentId =
        typeof invoice.payment_intent === 'string' ? invoice.payment_intent : invoice.payment_intent?.id;
      if (!tenantId || !paymentIntentId) {
        throw new BadRequestException('Missing metadata');
      }
      const pi = await this.stripeService.retrievePaymentIntent(paymentIntentId);
      const charge = pi.latest_charge as Stripe.Charge;
      await this.paymentsService.processGatewayPaymentUpdate(
        tenantId,
        charge.id,
        charge.amount_received / 100,
        charge.currency.toUpperCase(),
        BillingPaymentStatus.SUCCEEDED,
        new Date(charge.created * 1000),
        `stripe_${charge.payment_method_details?.type}`,
        charge.payment_method_details?.[charge.payment_method_details?.type] || {},
        charge as any,
        invoiceId,
      );
    } else {
      this.logger.warn(`Unhandled event ${event.type}`);
    }
  }

  async processPaypalEvent(payload: any): Promise<void> {
    this.logger.warn(`Paypal event type ${payload.event_type} (not handled)`);
  }
}
