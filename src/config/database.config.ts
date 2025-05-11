import { registerAs } from '@nestjs/config';

export const databaseConfig = registerAs('database', () => ({
  type: 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT, 10) || 3306,
  username: process.env.DB_USERNAME || 'root',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_DATABASE_IAM || 'bsa_iam_service_db',
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  synchronize: process.env.NODE_ENV === 'development',
  migrationsRun: process.env.NODE_ENV === 'production',
  migrations: [__dirname + '/../database/migrations/*{.ts,.js}'],
  logging: process.env.NODE_ENV === 'development' ? ['query', 'error'] : ['error'],
  charset: 'utf8mb4_unicode_ci',
  extra: { connectionLimit: parseInt(process.env.DB_CONNECTION_LIMIT, 10) || 10 },
}));
