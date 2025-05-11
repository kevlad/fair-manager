import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID, IsOptional, IsNumber, Min, IsEnum, IsDateString, IsObject, Length } from 'class-validator';
import { BillingPaymentStatus } from '../entities/billing-payment.entity';

export class RecordPaymentDto {
  @ApiProperty({ example: 'a1b2c3d4-e5f6-7890-1234-567890abcdef', description: 'Tenant ID making the payment' })
  @IsUUID('4')
  @IsNotEmpty()
  tenantId: string;

  @ApiPropertyOptional({ example: 'i1n2v3o4-i5c6-7890-1234-567890uvwxyz', description: 'Invoice ID this payment is for (if applicable)' })
  @IsUUID('4')
  @IsOptional()
  invoiceId?: string;

  @ApiProperty({ example: 'stripe_pm_xxxx', description: 'Method used for payment (e.g., credit_card, bank_transfer, or gateway payment method ID)' })
  @IsString()
  @IsNotEmpty()
  paymentMethodUsed: string;
  
  @ApiPropertyOptional({ example: { card_brand: 'visa', last4: '4242' }, description: 'Details about the payment method used' })
  @IsOptional()
  @IsObject()
  paymentMethodDetails?: Record<string, any>;

  @ApiPropertyOptional({ example: 'txn_123abc...', description: 'Transaction ID from the payment gateway' })
  @IsOptional()
  @IsString()
  paymentGatewayTransactionId?: string;

  @ApiProperty({ example: 99.9900, description: 'Amount paid' })
  @IsNumber({ maxDecimalPlaces: 4 })
  @Min(0.01)
  amount: number;

  @ApiProperty({ example: 'USD', description: 'Currency of the payment' })
  @IsString()
  @Length(3,3)
  currency: string;

  @ApiProperty({ example: BillingPaymentStatus.SUCCEEDED, description: 'Status of the payment', enum: BillingPaymentStatus })
  @IsEnum(BillingPaymentStatus)
  @IsNotEmpty()
  status: BillingPaymentStatus;

  @ApiProperty({ example: '2025-01-20T10:00:00Z', description: 'Date/time the payment was confirmed' })
  @IsDateString()
  @IsNotEmpty()
  paymentDate: string;

  @ApiPropertyOptional({ description: 'Raw response or relevant data from the payment gateway' })
  @IsOptional()
  @IsObject()
  gatewayResponse?: Record<string, any>;

  @ApiPropertyOptional({ example: 'Payment for INV-001', description: 'Internal notes about the payment' })
  @IsOptional()
  @IsString()
  notes?: string;
}