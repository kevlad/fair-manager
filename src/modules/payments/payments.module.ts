import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios'; // For potential future calls (e.g., to refunds on gateway)
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';
import { BillingPaymentEntity } from './entities/billing-payment.entity';
import { AuthModule } from '../auth/auth.module'; // For endpoint protection
import { InvoicesModule } from '../invoices/invoices.module'; // To interact with InvoicesService
import { RabbitMQModule } from '../../infrastructure/message-queue/rabbitmq.module'; // For publishing payment events

@Module({
  imports: [
    TypeOrmModule.forFeature([BillingPaymentEntity]),
    AuthModule,
    forwardRef(() => InvoicesModule), // Use forwardRef to handle circular dependency if InvoicesModule also imports PaymentsModule
    HttpModule,
    RabbitMQModule, // If publishing events like PaymentSucceeded, PaymentFailed
  ],
  controllers: [PaymentsController],
  providers: [PaymentsService],
  exports: [PaymentsService], // Export if other modules like PaymentGatewaysModule need it
})
export class PaymentsModule {}