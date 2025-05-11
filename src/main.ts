---
**File: `iam-service/src/main.ts`**
---
```typescript
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { Logger, ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import * as cookieParser from 'cookie-parser';
// import * as csurf from 'csurf'; // If using csurf with sessions/cookies
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { TransformResponseInterceptor } from './common/interceptors/transform-response.interceptor'; // Assuming you create this
import { setupSwagger } from './swagger'; // Assuming you create this utility

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const port = configService.get<number>('APP_PORT') || 3001;
  const environment = configService.get<string>('NODE_ENV') || 'development';

  // Security Middlewares
  app.use(helmet()); // Basic security headers
  app.enableCors({ // Configure CORS appropriately for your frontend
    origin: configService.get<string>('CORS_ORIGIN') || '*', // Be specific in production
    credentials: true,
  });
  app.use(cookieParser()); // For parsing cookies, useful for refresh tokens

  // CSRF Protection (if using cookie-based sessions and not pure JWT for frontend)
  // app.use(csurf({ cookie: true })); // Ensure cookie parser is used before csurf

  // Global Pipes
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Strips properties that do not have any decorators
      forbidNonWhitelisted: true, // Throw an error if non-whitelisted values are provided
      transform: true, // Automatically transform payloads to DTO instances
      transformOptions: {
        enableImplicitConversion: true, // Allows conversion of path/query params to expected types
      },
    }),
  );

  // Global Filters
  app.useGlobalFilters(new HttpExceptionFilter());

  // Global Interceptors (Optional: for standardizing response format)
  app.useGlobalInterceptors(new TransformResponseInterceptor());

  // API Versioning (Optional, can also be done per controller)
  // app.setGlobalPrefix('api/v1');

  // Swagger API Documentation (OpenAPI)
  if (environment !== 'production') {
    setupSwagger(app); // Utility function to setup Swagger
  }

  await app.listen(port);
  Logger.log(`🚀 IAM Service is running on: http://localhost:${port}`, 'Bootstrap');
  Logger.log(`🌱 Environment: ${environment}`, 'Bootstrap');
}
bootstrap();
