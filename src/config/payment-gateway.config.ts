import { registerAs } from '@nestjs/config';

export const paymentGatewayConfig = registerAs('payment_gateway', () => ({
  stripe: {
    apiKey: process.env.STRIPE_SECRET_KEY,
    publicKey: process.env.STRIPE_PUBLIC_KEY,
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
  },
  paypal: {
    clientId: process.env.PAYPAL_CLIENT_ID,
    clientSecret: process.env.PAYPAL_CLIENT_SECRET,
    environment: process.env.PAYPAL_ENVIRONMENT || 'sandbox',
    webhookId: process.env.PAYPAL_WEBHOOK_ID,
  },
}));
