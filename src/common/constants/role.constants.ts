// These roles are conceptual and should align with what IAM service issues in JWTs.
export enum Role {
  PLATFORM_ADMIN = 'platform_admin',
  PLATFORM_SUPPORT = 'platform_support',
  TENANT_ADMIN = 'tenant_admin',
  TENANT_USER = 'tenant_user',
  MODULE_MANAGER = 'module_manager',
  SERVICE_ACCOUNT_BILLING = 'service_account_billing',
}
