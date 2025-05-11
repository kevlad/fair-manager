import { registerAs } from '@nestjs/config';

export const jwtConfig = registerAs('jwt', () => ({
  secret: process.env.JWT_SECRET || 'YOUR_VERY_SECRET_KEY_CHANGE_ME_IN_PROD',
  audience: process.env.JWT_TOKEN_AUDIENCE || 'business-suite-ai',
  issuer: process.env.JWT_TOKEN_ISSUER || 'iam.business-suite.ai',
  accessTokenTtl: parseInt(process.env.JWT_ACCESS_TOKEN_TTL_SECONDS, 10) || 3600,
  refreshTokenTtl: parseInt(process.env.JWT_REFRESH_TOKEN_TTL_SECONDS, 10) || 2592000,
}));
