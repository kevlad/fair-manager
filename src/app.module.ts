---
**File: `iam-service/src/app.module.ts`**
---
```typescript
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { appConfig } from './config/app.config';
import { databaseConfig } from './config/database.config';
import { jwtConfig } from './config/jwt.config';
import { HealthModule } from './health/health.module';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { RolesModule } from './modules/roles/roles.module';
import { PermissionsModule } from './modules/permissions/permissions.module';
import { ClientsModule } from './modules/clients/clients.module';
import { TypeOrmModule } from '@nestjs/typeorm'; // If using TypeORM
import { TypeOrmConfigService } from './database/typeorm.config.service'; // If using TypeORM
// import { PrismaModule } from './database/prisma/prisma.module'; // If using Prisma
import { CorrelationIdMiddleware } from './common/middleware/correlation-id.middleware';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Makes ConfigModule available globally
      load: [appConfig, databaseConfig, jwtConfig], // Load custom config files
      envFilePath: `.env.${process.env.NODE_ENV || 'development'}`, // e.g., .env.development
    }),
    // If using TypeORM:
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService,
    }),
    // If using Prisma:
    // PrismaModule,
    HealthModule,
    AuthModule,
    UsersModule,
    RolesModule,
    PermissionsModule,
    ClientsModule,
    // Add other foundational modules for IAM here (e.g., MfaModule)
  ],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(CorrelationIdMiddleware).forRoutes('*');
  }
}
