import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { BillingInvoiceEntity, BillingInvoiceStatus } from '../entities/billing-invoice.entity';
import { InvoiceLineItemResponseDto } from './invoice-line-item-response.dto';

export class InvoiceResponseDto {
  @ApiProperty({ format: 'uuid' })
  id: string;

  @ApiProperty({ format: 'uuid' })
  tenantId: string;

  @ApiProperty({ format: 'uuid' })
  subscriptionId: string;

  @ApiProperty()
  invoiceNumber: string;

  @ApiProperty({ enum: BillingInvoiceStatus })
  status: BillingInvoiceStatus;

  @ApiProperty({ type: String, format: 'date' })
  issueDate: Date;

  @ApiProperty({ type: String, format: 'date' })
  dueDate: Date;

  @ApiProperty()
  currency: string;

  @ApiProperty()
  subtotalAmount: number;

  @ApiProperty()
  taxAmount: number;

  @ApiProperty()
  totalAmount: number;

  @ApiProperty()
  amountPaid: number;

  @ApiProperty()
  amountDue: number;

  @ApiPropertyOptional({ nullable: true })
  notes?: string | null;

  @ApiPropertyOptional({ format: 'uuid', nullable: true })
  pdfDocumentId?: string | null;

  @ApiPropertyOptional({ nullable: true })
  paymentGatewayChargeId?: string | null;

  @ApiPropertyOptional({ nullable: true })
  paidAt?: Date | null;
  
  @ApiPropertyOptional({ nullable: true })
  voidedAt?: Date | null;

  @ApiPropertyOptional({ nullable: true })
  dunningStatus?: string | null;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty({ type: [InvoiceLineItemResponseDto] })
  lineItems: InvoiceLineItemResponseDto[];

  constructor(invoice: BillingInvoiceEntity) {
    this.id = invoice.id;
    this.tenantId = invoice.tenantId;
    this.subscriptionId = invoice.subscriptionId;
    this.invoiceNumber = invoice.invoiceNumber;
    this.status = invoice.status;
    this.issueDate = invoice.issueDate;
    this.dueDate = invoice.dueDate;
    this.currency = invoice.currency;
    this.subtotalAmount = Number(invoice.subtotalAmount);
    this.taxAmount = Number(invoice.taxAmount);
    this.totalAmount = Number(invoice.totalAmount);
    this.amountPaid = Number(invoice.amountPaid);
    this.amountDue = Number(invoice.amountDue);
    this.notes = invoice.notes;
    this.pdfDocumentId = invoice.pdfDocumentId;
    this.paymentGatewayChargeId = invoice.paymentGatewayChargeId;
    this.paidAt = invoice.paidAt;
    this.voidedAt = invoice.voidedAt;
    this.dunningStatus = invoice.dunningStatus;
    this.createdAt = invoice.createdAt;
    this.updatedAt = invoice.updatedAt;
    this.lineItems = invoice.lineItems ? invoice.lineItems.map(li => new InvoiceLineItemResponseDto(li)) : [];
  }
}
