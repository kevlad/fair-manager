import { CanActivate, ExecutionContext, Injectable, Logger, BadRequestException } from '@nestjs/common';
import { StripeService } from '../strategies/stripe.service';
import { Request } from 'express';

@Injectable()
export class StripeWebhookGuard implements CanActivate {
  private readonly logger = new Logger(StripeWebhookGuard.name);

  constructor(private stripeService: StripeService) {}

  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest<Request & { rawBody?: Buffer }>();
    const sig = req.headers['stripe-signature'] as string;
    if (!sig) throw new BadRequestException('Missing signature');
    if (!req.rawBody) throw new BadRequestException('Raw body required');
    const event = this.stripeService.constructEvent(req.rawBody, sig);
    (req as any).stripeEvent = event;
    return true;
  }
}
