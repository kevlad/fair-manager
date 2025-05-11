import { Entity, PrimaryColumn, Column, CreateDateColumn, UpdateDateColumn, Index, ManyToOne, JoinColumn, VersionColumn } from 'typeorm';
import { BillingInvoiceEntity } from '../../invoices/entities/billing-invoice.entity';
// If you have a BillingPaymentGatewayConfigEntity for BSA's own gateway configs:
// import { BillingPaymentGatewayConfigEntity } from '../../payment-gateways/entities/billing-payment-gateway-config.entity'; // Adjust path

export enum BillingPaymentStatus {
  PENDING = 'pending', // Payment initiated but not yet confirmed/processed
  SUCCEEDED = 'succeeded', // Payment successful
  FAILED = 'failed', // Payment attempt failed
  REFUNDED = 'refunded', // Payment was fully refunded
  PARTIALLY_REFUNDED = 'partially_refunded', // Payment was partially refunded
  DISPUTED = 'disputed', // Payment is under dispute (chargeback)
  REQUIRES_ACTION = 'requires_action', // e.g., 3D Secure needed, or other SCA
  CANCELED = 'canceled', // Payment was canceled by user or system before completion
}

@Entity('billing_payments') // Table name for payments BSA receives from tenants
export class BillingPaymentEntity {
  @PrimaryColumn('char', { length: 36 }) // UUID
  id: string;

  @Index()
  @Column({ name: 'tenant_id', type: 'char', length: 36 })
  tenantId: string; // The tenant who made the payment to BSA

  @Index()
  @Column({ name: 'invoice_id', type: 'char', length: 36, nullable: true })
  invoiceId: string | null; // The BSA invoice this payment is for (can be null for account top-ups/credits)

  @ManyToOne(() => BillingInvoiceEntity, { onDelete: 'SET NULL', nullable: true, lazy: true }) // Lazy load invoice
  @JoinColumn({ name: 'invoice_id' })
  invoice: Promise<BillingInvoiceEntity | null>; // Use Promise for lazy loading

  @Index()
  @Column({ name: 'payment_gateway_config_id', type: 'char', length: 36, nullable: true })
  paymentGatewayConfigId: string | null; // FK to BSA's own billing_payment_gateway_configs table (if used)

  // @ManyToOne(() => BillingPaymentGatewayConfigEntity, { onDelete: 'SET NULL', nullable: true })
  // @JoinColumn({ name: 'payment_gateway_config_id' })
  // paymentGatewayConfig: BillingPaymentGatewayConfigEntity | null;

  @Column({ name: 'payment_method_used', type: 'varchar', length: 100 })
  paymentMethodUsed: string; // e.g., 'stripe_card_pm_xxxx', 'paypal_transaction', 'manual_bank_transfer'

  @Column({ name: 'payment_method_details', type: 'json', nullable: true })
  paymentMethodDetails: Record<string, any> | null; // e.g., { card_brand: 'visa', last4: '4242', bank_name: '...' }

  @Index({ unique: true, where: "payment_gateway_transaction_id IS NOT NULL" })
  @Column({ name: 'payment_gateway_transaction_id', type: 'varchar', length: 255, nullable: true })
  paymentGatewayTransactionId: string | null; // Transaction ID from the external payment gateway

  @Column({ type: 'decimal', precision: 12, scale: 4 }) // Using 4 decimal places for precision
  amount: number;

  @Column({ type: 'char', length: 3 })
  currency: string; // e.g., USD, EUR, RON

  @Index()
  @Column({
    type: 'varchar',
    length: 50,
    enum: BillingPaymentStatus,
    default: BillingPaymentStatus.PENDING,
  })
  status: BillingPaymentStatus;

  @Column({ name: 'payment_date', type: 'timestamp' }) // Timestamp when payment was confirmed/processed by gateway or manually
  paymentDate: Date;

  @Column({ name: 'gateway_response', type: 'json', nullable: true })
  gatewayResponse: Record<string, any> | null; // Store raw/relevant response from gateway for auditing/debugging

  @Column({ type: 'text', nullable: true })
  notes: string | null; // Internal notes about the payment (e.g., manual payment reference)

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;
  
  @VersionColumn()
  version: number;

  @Column({ name: 'refunded_amount', type: 'decimal', precision: 12, scale: 4, default: 0.0000 })
  refundedAmount: number;

  @Column({ name: 'effective_date', type: 'date', nullable: true }) // When the funds are considered settled/available
  effectiveDate: Date | null;
}