import { registerAs } from '@nestjs/config';

export const appConfig = registerAs('app', () => ({
  nodeEnv: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.APP_PORT, 10) || 3001,
  appName: process.env.APP_NAME || 'IAM Service',
  apiGlobalPrefix: process.env.API_GLOBAL_PREFIX || 'iam/api',
  apiVersion: process.env.API_VERSION || 'v1',
  corsOrigin: process.env.CORS_ORIGIN || '*',
}));
