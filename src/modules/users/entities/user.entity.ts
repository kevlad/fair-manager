import { Entity, PrimaryColumn, Column, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';

@Entity('iam_users')
@Index(['email', 'tenantId'], { unique: true, where: 'tenant_id IS NOT NULL' })
@Index(['email'], { unique: true, where: 'tenant_id IS NULL' })
export class UserEntity {
  @PrimaryColumn('char', { length: 36 })
  id: string;

  @Column({ type: 'char', length: 36, nullable: true })
  tenantId: string | null;

  @Column({ type: 'varchar', length: 255 })
  email: string;

  @Column({ name: 'hashed_password', type: 'varchar', length: 255 })
  hashedPassword?: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  firstName: string | null;

  @Column({ type: 'varchar', length: 100, nullable: true })
  lastName: string | null;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive: boolean;

  @Column({ name: 'is_email_verified', type: 'boolean', default: false })
  isEmailVerified: boolean;

  @Column({ name: 'email_verification_token', type: 'varchar', length: 100, nullable: true })
  emailVerificationToken: string | null;

  @Column({ name: 'email_verification_token_expires_at', type: 'timestamp', nullable: true })
  emailVerificationTokenExpiresAt: Date | null;

  @Column({ name: 'password_reset_token', type: 'varchar', length: 100, nullable: true })
  passwordResetToken: string | null;

  @Column({ name: 'password_reset_token_expires_at', type: 'timestamp', nullable: true })
  passwordResetTokenExpiresAt: Date | null;

  @Column({ name: 'last_login_at', type: 'timestamp', nullable: true })
  lastLoginAt: Date | null;

  @Column({ name: 'last_ip_address', type: 'varchar', length: 45, nullable: true })
  lastIpAddress: string | null;

  @Column({ name: 'failed_login_attempts', type: 'int', default: 0 })
  failedLoginAttempts: number;

  @Column({ name: 'locked_until', type: 'timestamp', nullable: true })
  lockedUntil: Date | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
