import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  constructor(private configService: ConfigService) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    const dbConfig = this.configService.get('database');
    return {
      type: dbConfig.type,
      host: dbConfig.host,
      port: dbConfig.port,
      username: dbConfig.username,
      password: dbConfig.password,
      database: dbConfig.database,
      entities: dbConfig.entities,
      synchronize: dbConfig.synchronize,
      migrationsRun: dbConfig.migrationsRun,
      migrations: dbConfig.migrations,
      logging: dbConfig.logging,
      charset: dbConfig.charset,
      extra: dbConfig.extra,
      autoLoadEntities: true,
    };
  }
}
