import { Controller, Post, Body, Headers, Req, Res, HttpStatus, Logger, UseGuards } from '@nestjs/common';
import { PaymentGatewaysService } from './payment-gateways.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { StripeWebhookGuard } from './guards/stripe-webhook.guard';
import { Public } from '../../common/decorators/public.decorator';

@ApiTags('Payment Gateway Webhooks')
@Controller({ path: 'payment-gateways/webhooks', version: '1' })
export class PaymentGatewaysController {
  private readonly logger = new Logger(PaymentGatewaysController.name);

  constructor(private readonly paymentGatewaysService: PaymentGatewaysService) {}

  @Public()
  @Post('stripe')
  @UseGuards(StripeWebhookGuard)
  @ApiOperation({ summary: 'Stripe Webhook Handler' })
  @ApiResponse({ status: 200, description: 'Webhook received.' })
  async handleStripeWebhook(
    @Headers('stripe-signature') signature: string,
    @Req() req: Request & { rawBody?: Buffer },
    @Res() res: Response,
  ) {
    const event = (req as any).stripeEvent;
    if (!event) {
      this.logger.error('Stripe webhook event missing.');
      return res.status(HttpStatus.BAD_REQUEST).send('Event missing');
    }
    try {
      await this.paymentGatewaysService.processStripeEvent(event);
      return res.status(HttpStatus.OK).send({ received: true });
    } catch (e) {
      this.logger.error(e.message, e.stack);
      return res.status(HttpStatus.BAD_REQUEST).send({ error: 'Processing failed' });
    }
  }

  @Public()
  @Post('paypal')
  @ApiOperation({ summary: 'PayPal Webhook Handler (placeholder)' })
  @ApiResponse({ status: 200, description: 'Webhook received.' })
  async handlePaypalWebhook(@Body() payload: any, @Res() res: Response) {
    await this.paymentGatewaysService.processPaypalEvent(payload);
    return res.status(HttpStatus.OK).send({ received: true });
  }
}
