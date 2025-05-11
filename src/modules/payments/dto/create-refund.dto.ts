import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID, IsOptional, IsNumber, Min, MaxLength } from 'class-validator';

export class CreateRefundDto {
  @ApiProperty({ example: 'p1a2y3m4-e5n6-7890-1234-567890qrstuv', description: 'Original Payment ID to be refunded' })
  @IsUUID('4')
  @IsNotEmpty()
  originalPaymentId: string;

  @ApiProperty({ example: 50.0000, description: 'Amount to refund (must be less than or equal to refundable amount on original payment)' })
  @IsNumber({ maxDecimalPlaces: 4 })
  @Min(0.01)
  amount: number;
  
  @ApiPropertyOptional({ example: 'Customer requested partial refund.', description: 'Reason for the refund' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  reason?: string;

  @ApiPropertyOptional({ example: 'REFUND_TXN_789xyz', description: 'Transaction ID for the refund from the payment gateway (if applicable)'})
  @IsOptional()
  @IsString()
  @MaxLength(255)
  gatewayRefundTransactionId?: string;
  
  @ApiPropertyOptional({ example: 'REF_ADMIN_MANUAL', description: 'Internal reference for the refund action'})
  @IsOptional()
  @IsString()
  @MaxLength(100)
  internalReference?: string;
}