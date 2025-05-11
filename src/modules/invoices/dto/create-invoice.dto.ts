import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID, IsOptional, IsDateString, IsArray, ValidateNested, IsEnum, ArrayMinSize, MaxLength, Length } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateInvoiceLineItemDto } from './create-invoice-line-item.dto';
import { BillingInvoiceStatus } from '../entities/billing-invoice.entity';

export class CreateInvoiceDto {
  @ApiProperty({ example: 'a1b2c3d4-e5f6-7890-1234-567890abcdef', description: 'Tenant ID being invoiced' })
  @IsUUID('4')
  @IsNotEmpty()
  tenantId: string;

  @ApiProperty({ example: 's1b2c3d4-e5f6-7890-1234-567890uvwxyz', description: 'Subscription ID this invoice relates to' })
  @IsUUID('4')
  @IsNotEmpty()
  subscriptionId: string;

  @ApiPropertyOptional({ example: 'BSA-INV-2025-00001', description: 'Invoice number (if manually set, otherwise auto-generated)' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  invoiceNumber?: string;

  @ApiProperty({ example: '2025-01-15', description: 'Date the invoice is issued (YYYY-MM-DD)' })
  @IsDateString()
  @IsNotEmpty()
  issueDate: string;

  @ApiProperty({ example: '2025-02-14', description: 'Date payment is due (YYYY-MM-DD)' })
  @IsDateString()
  @IsNotEmpty()
  dueDate: string;

  @ApiProperty({ example: 'USD', description: 'Currency code (3 letters)', default: 'USD' })
  @IsString()
  @Length(3,3)
  currency: string = 'USD';

  @ApiPropertyOptional({ example: BillingInvoiceStatus.OPEN, description: 'Initial status of the invoice', enum: BillingInvoiceStatus })
  @IsOptional()
  @IsEnum(BillingInvoiceStatus)
  status?: BillingInvoiceStatus = BillingInvoiceStatus.DRAFT;

  @ApiProperty({ type: [CreateInvoiceLineItemDto], description: 'Array of line items for the invoice' })
  @IsArray()
  @ValidateNested({ each: true })
  @ArrayMinSize(1)
  @Type(() => CreateInvoiceLineItemDto)
  lineItems: CreateInvoiceLineItemDto[];

  @ApiPropertyOptional({ example: 'Thank you for your business!', description: 'Notes to appear on the invoice or internal notes' })
  @IsOptional()
  @IsString()
  notes?: string;
}
