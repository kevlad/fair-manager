import { Entity, PrimaryColumn, Column, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';

export enum PaymentGatewayType {
  STRIPE = 'stripe',
  PAYPAL = 'paypal',
  NETOPIA = 'netopia',
  PAYU = 'payu',
  MANUAL = 'manual',
}

@Entity('billing_payment_gateway_configs')
export class BillingPaymentGatewayConfigEntity {
  @PrimaryColumn('char', { length: 36 })
  id: string;

  @Index({ unique: true })
  @Column({ name: 'gateway_type', type: 'varchar', length: 50, enum: PaymentGatewayType })
  gatewayType: PaymentGatewayType;

  @Column({ name: 'display_name', type: 'varchar', length: 255 })
  displayName: string;

  @Column({ type: 'json', nullable: true })
  configuration: Record<string, any> | null;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive: boolean;

  @Column({ name: 'is_default_for_currency', type: 'json', nullable: true })
  isDefaultForCurrency: Record<string, boolean> | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
