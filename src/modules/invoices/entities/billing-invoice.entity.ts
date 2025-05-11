import { Entity, PrimaryColumn, Column, CreateDateColumn, UpdateDateColumn, Index, OneToMany, VersionColumn } from 'typeorm';
import { BillingInvoiceLineItemEntity } from './billing-invoice-line-item.entity';

export enum BillingInvoiceStatus {
  DRAFT = 'draft', // Invoice created but not yet finalized or sent
  OPEN = 'open', // Invoice finalized and sent to tenant, awaiting payment
  PAID = 'paid', // Invoice fully paid
  PARTIALLY_PAID = 'partially_paid', // Invoice partially paid
  VOID = 'void', // Invoice canceled after being issued
  UNCOLLECTIBLE = 'uncollectible', // Invoice deemed uncollectible
  PENDING_PAYMENT_CONFIRMATION = 'pending_payment_confirmation', // Payment initiated, awaiting confirmation
  OVERDUE = 'overdue', // Invoice past its due date and not fully paid
}

@Entity('billing_invoices')
export class BillingInvoiceEntity {
  @PrimaryColumn('char', { length: 36 }) // UUID
  id: string;

  @Index()
  @Column({ name: 'tenant_id', type: 'char', length: 36 })
  tenantId: string; // The tenant being invoiced by BSA

  @Index()
  @Column({ name: 'subscription_id', type: 'char', length: 36 })
  subscriptionId: string; // The specific BSA subscription this invoice is for

  @Index({ unique: true }) // Assuming BSA invoice numbers are globally unique for BSA
  @Column({ name: 'invoice_number', type: 'varchar', length: 100 })
  invoiceNumber: string; // Human-readable, sequential (e.g., BSA-INV-2025-00001)

  @Index()
  @Column({
    type: 'varchar',
    length: 50,
    enum: BillingInvoiceStatus,
    default: BillingInvoiceStatus.DRAFT,
  })
  status: BillingInvoiceStatus;

  @Column({ name: 'issue_date', type: 'date' })
  issueDate: Date; // Date the invoice was officially issued

  @Column({ name: 'due_date', type: 'date' })
  dueDate: Date; // Date by which payment is expected

  @Column({ type: 'char', length: 3 })
  currency: string; // e.g., USD, EUR, RON

  @Column({ name: 'subtotal_amount', type: 'decimal', precision: 12, scale: 4 })
  subtotalAmount: number; // Sum of line item amounts before tax

  @Column({ name: 'tax_amount', type: 'decimal', precision: 12, scale: 4, default: 0.0 })
  taxAmount: number;

  @Column({ name: 'total_amount', type: 'decimal', precision: 12, scale: 4 })
  totalAmount: number; // subtotal + tax

  @Column({ name: 'amount_paid', type: 'decimal', precision: 12, scale: 4, default: 0.0 })
  amountPaid: number;

  @Column({ name: 'amount_due', type: 'decimal', precision: 12, scale: 4 })
  amountDue: number; // totalAmount - amountPaid

  @Column({ type: 'text', nullable: true })
  notes: string | null; // Internal notes or notes to appear on the invoice

  @Column({ name: 'pdf_document_id', type: 'char', length: 36, nullable: true })
  pdfDocumentId: string | null; // FK to Document Management Service document ID

  @Column({ name: 'payment_gateway_charge_id', type: 'varchar', length: 255, nullable: true })
  paymentGatewayChargeId: string | null; // If directly charged via a gateway for this invoice

  @Column({ name: 'paid_at', type: 'timestamp', nullable: true })
  paidAt: Date | null;

  @Column({ name: 'voided_at', type: 'timestamp', nullable: true })
  voidedAt: Date | null;

  @Column({ name: 'last_payment_attempt_at', type: 'timestamp', nullable: true })
  lastPaymentAttemptAt: Date | null;
  
  @Column({ name: 'dunning_status', type: 'varchar', length: 50, nullable: true }) // e.g., reminder_sent_1, final_notice, collection
  dunningStatus: string | null;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;

  @VersionColumn() // Optimistic locking
  version: number;

  @OneToMany(() => BillingInvoiceLineItemEntity, (lineItem) => lineItem.invoice, {
    cascade: true, // If invoice is saved, line items are also saved
    eager: false,   // Load line items explicitly when needed
  })
  lineItems: BillingInvoiceLineItemEntity[];
}
