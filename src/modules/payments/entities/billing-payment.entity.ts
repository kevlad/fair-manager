import { Entity, PrimaryColumn, Column, CreateDateColumn, UpdateDateColumn, Index, ManyToOne, JoinColumn } from 'typeorm';
import { BillingInvoiceEntity } from '../../invoices/entities/billing-invoice.entity'; // Assuming path
// If you have a BillingPaymentGatewayEntity for BSA's own gateway configs:
// import { BillingPaymentGatewayEntity } from '../../payment-gateways/entities/billing-payment-gateway.entity';

export enum BillingPaymentStatus {
  PENDING = 'pending', // Payment initiated but not yet confirmed
  SUCCEEDED = 'succeeded', // Payment successful
  FAILED = 'failed', // Payment failed
  REFUNDED = 'refunded', // Payment was refunded (fully or partially)
  PARTIALLY_REFUNDED = 'partially_refunded',
  DISPUTED = 'disputed', // Payment is under dispute
  REQUIRES_ACTION = 'requires_action', // e.g., 3D Secure needed
  CANCELED = 'canceled', // Payment was canceled before completion
}

@Entity('billing_payments')
export class BillingPaymentEntity {
  @PrimaryColumn('char', { length: 36 }) // UUID
  id: string;

  @Index()
  @Column({ name: 'tenant_id', type: 'char', length: 36 })
  tenantId: string; // The tenant who made the payment to BSA

  @Index()
  @Column({ name: 'invoice_id', type: 'char', length: 36, nullable: true })
  invoiceId: string | null; // The invoice this payment is for (can be null for pre-payments)

  @ManyToOne(() => BillingInvoiceEntity, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'invoice_id' })
  invoice: BillingInvoiceEntity | null;

  @Index()
  @Column({ name: 'payment_gateway_config_id', type: 'char', length: 36, nullable: true })
  paymentGatewayConfigId: string | null; // FK to BSA's own billing_payment_gateways table if used

  // @ManyToOne(() => BillingPaymentGatewayEntity, { onDelete: 'SET NULL', nullable: true })
  // @JoinColumn({ name: 'payment_gateway_config_id' })
  // paymentGatewayConfig: BillingPaymentGatewayEntity | null;

  @Column({ name: 'payment_method_used', type: 'varchar', length: 50 })
  paymentMethodUsed: string; // e.g., credit_card, bank_transfer, paypal, stripe_pm_xxxx

  @Column({ name: 'payment_method_details', type: 'json', nullable: true })
  paymentMethodDetails: Record<string, any> | null; // e.g., { card_brand: 'visa', last4: '4242' }

  @Index({ unique: true, where: "payment_gateway_transaction_id IS NOT NULL" })
  @Column({ name: 'payment_gateway_transaction_id', type: 'varchar', length: 255, nullable: true })
  paymentGatewayTransactionId: string | null; // Transaction ID from the payment gateway

  @Column({ type: 'decimal', precision: 12, scale: 4 })
  amount: number;

  @Column({ type: 'char', length: 3 })
  currency: string;

  @Index()
  @Column({
    type: 'varchar',
    length: 50,
    enum: BillingPaymentStatus,
    default: BillingPaymentStatus.PENDING,
  })
  status: BillingPaymentStatus;

  @Column({ name: 'payment_date', type: 'timestamp' }) // Timestamp when payment was confirmed/processed
  paymentDate: Date;

  @Column({ name: 'gateway_response', type: 'json', nullable: true })
  gatewayResponse: Record<string, any> | null; // Store raw response from gateway for auditing

  @Column({ type: 'text', nullable: true })
  notes: string | null; // Internal notes about the payment

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;

  @Column({ name: 'refunded_amount', type: 'decimal', precision: 12, scale: 4, default: 0.0 })
  refundedAmount: number;
}