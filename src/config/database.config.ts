---
**File: `iam-service/src/config/database.config.ts`** (MySQL specific for TypeORM)
---
```typescript
import { registerAs } from '@nestjs/config';

export const databaseConfig = registerAs('database', () => ({
  type: 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT, 10) || 3306,
  username: process.env.DB_USERNAME || 'root',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_DATABASE_IAM || 'bsa_iam_service_db', // Specific DB for IAM
  entities: [__dirname + '/../**/*.entity{.ts,.js}'], // Path to your entities
  synchronize: process.env.NODE_ENV === 'development', // !!! NEVER TRUE IN PRODUCTION !!! Use migrations instead.
  migrationsRun: process.env.NODE_ENV === 'production', // Run migrations automatically in prod
  migrations: [__dirname + '/../database/migrations/*{.ts,.js}'],
  logging: process.env.NODE_ENV === 'development' ? ['query', 'error'] : ['error'], // Adjust logging as needed
  charset: 'utf8mb4_unicode_ci',
  extra: {
    connectionLimit: parseInt(process.env.DB_CONNECTION_LIMIT, 10) || 10,
  },
  // For Prisma, this file would be different, or Prisma uses schema.prisma and .env
}));
