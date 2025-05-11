import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { BillingPaymentEntity, BillingPaymentStatus } from '../entities/billing-payment.entity';

export class PaymentResponseDto {
  @ApiProperty({ format: 'uuid' })
  id: string;

  @ApiProperty({ format: 'uuid' })
  tenantId: string;

  @ApiPropertyOptional({ format: 'uuid', nullable: true })
  invoiceId?: string | null;

  @ApiProperty()
  paymentMethodUsed: string;
  
  @ApiPropertyOptional({ type: 'object' })
  paymentMethodDetails?: Record<string, any> | null;

  @ApiPropertyOptional({ nullable: true })
  paymentGatewayTransactionId?: string | null;

  @ApiProperty()
  amount: number;

  @ApiProperty()
  currency: string;

  @ApiProperty({ enum: BillingPaymentStatus })
  status: BillingPaymentStatus;

  @ApiProperty()
  paymentDate: Date;

  @ApiPropertyOptional({ nullable: true })
  notes?: string | null;
  
  @ApiProperty()
  refundedAmount: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  constructor(payment: BillingPaymentEntity) {
    this.id = payment.id;
    this.tenantId = payment.tenantId;
    this.invoiceId = payment.invoiceId;
    this.paymentMethodUsed = payment.paymentMethodUsed;
    this.paymentMethodDetails = payment.paymentMethodDetails;
    this.paymentGatewayTransactionId = payment.paymentGatewayTransactionId;
    this.amount = Number(payment.amount);
    this.currency = payment.currency;
    this.status = payment.status;
    this.paymentDate = payment.paymentDate;
    this.notes = payment.notes;
    this.refundedAmount = Number(payment.refundedAmount);
    this.createdAt = payment.createdAt;
    this.updatedAt = payment.updatedAt;
  }
}