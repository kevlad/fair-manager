import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsEnum, IsOptional, IsString, IsDateString, IsNumber, Min } from 'class-validator';
import { BillingInvoiceStatus } from '../entities/billing-invoice.entity';

export class UpdateInvoiceStatusDto {
  @ApiProperty({ example: BillingInvoiceStatus.PAID, description: 'New status for the invoice', enum: BillingInvoiceStatus })
  @IsEnum(BillingInvoiceStatus)
  @IsNotEmpty()
  status: BillingInvoiceStatus;

  @ApiPropertyOptional({ example: '2025-01-20T10:00:00Z', description: 'Timestamp when the invoice was paid (if status is PAID)' })
  @IsOptional()
  @IsDateString()
  paidAt?: string;

  @ApiPropertyOptional({ example: 99.99, description: 'Amount paid (if status is PARTIALLY_PAID or PAID)' })
  @IsOptional()
  @IsNumber({maxDecimalPlaces: 4})
  @Min(0.01)
  amountPaid?: number;

  @ApiPropertyOptional({ example: 'ch_123abc...', description: 'Payment gateway charge ID (if applicable)' })
  @IsOptional()
  @IsString()
  paymentGatewayChargeId?: string;
  
  @ApiPropertyOptional({ example: 'Voided due to incorrect items.', description: 'Reason if status is VOID or UNCOLLECTIBLE' })
  @IsOptional()
  @IsString()
  reason?: string;
}
