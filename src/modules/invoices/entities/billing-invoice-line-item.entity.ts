import { Entity, PrimaryColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, Index } from 'typeorm';
import { BillingInvoiceEntity } from './billing-invoice.entity';

@Entity('billing_invoice_line_items')
export class BillingInvoiceLineItemEntity {
  @PrimaryColumn('char', { length: 36 }) // UUID
  id: string;

  @Index()
  @Column({ name: 'invoice_id', type: 'char', length: 36 })
  invoiceId: string;

  @ManyToOne(() => BillingInvoiceEntity, (invoice) => invoice.lineItems, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'invoice_id' })
  invoice: BillingInvoiceEntity;
  
  @Column({ name: 'tenant_id', type: 'char', length: 36 }) // Denormalized for easier querying if needed, matches invoice.tenantId
  tenantId: string;

  @Column({ type: 'text' })
  description: string; // e.g., "Business Suite AI - Pro Plan (Monthly: Jan 2025)"

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  quantity: number;

  @Column({ name: 'unit_price', type: 'decimal', precision: 12, scale: 4 })
  unitPrice: number;

  @Column({ type: 'decimal', precision: 12, scale: 4 }) // quantity * unitPrice
  amount: number;

  @Column({ name: 'tax_rate_percentage', type: 'decimal', precision: 5, scale: 2, default: 0.0 })
  taxRatePercentage: number; // e.g., 19.00 for 19%

  @Column({ name: 'tax_amount_line', type: 'decimal', precision: 12, scale: 4, default: 0.0 })
  taxAmountLine: number; // Tax for this specific line item

  @Column({ name: 'product_code', type: 'varchar', length: 100, nullable: true })
  productCode: string | null; // Internal product/plan code from Subscription Manager

  @Column({ name: 'service_period_start', type: 'date', nullable: true })
  servicePeriodStart: Date | null; // For recurring services

  @Column({ name: 'service_period_end', type: 'date', nullable: true })
  servicePeriodEnd: Date | null;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;
}
