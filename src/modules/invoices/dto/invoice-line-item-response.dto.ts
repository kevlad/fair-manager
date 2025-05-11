import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { BillingInvoiceLineItemEntity } from '../entities/billing-invoice-line-item.entity';

export class InvoiceLineItemResponseDto {
  @ApiProperty({ format: 'uuid' })
  id: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  quantity: number;

  @ApiProperty()
  unitPrice: number;

  @ApiProperty()
  amount: number;

  @ApiPropertyOptional()
  taxRatePercentage?: number;

  @ApiPropertyOptional()
  taxAmountLine?: number;

  @ApiPropertyOptional()
  productCode?: string | null;

  @ApiPropertyOptional({ type: String, format: 'date' })
  servicePeriodStart?: Date | null;

  @ApiPropertyOptional({ type: String, format: 'date' })
  servicePeriodEnd?: Date | null;

  constructor(lineItem: BillingInvoiceLineItemEntity) {
    this.id = lineItem.id;
    this.description = lineItem.description;
    this.quantity = Number(lineItem.quantity);
    this.unitPrice = Number(lineItem.unitPrice);
    this.amount = Number(lineItem.amount);
    this.taxRatePercentage = Number(lineItem.taxRatePercentage);
    this.taxAmountLine = Number(lineItem.taxAmountLine);
    this.productCode = lineItem.productCode;
    this.servicePeriodStart = lineItem.servicePeriodStart;
    this.servicePeriodEnd = lineItem.servicePeriodEnd;
  }
}
