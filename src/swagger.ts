import { INestApplication } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';

export function setupSwagger(app: INestApplication): void {
  const configService = app.get(ConfigService);
  const appName = configService.get<string>('app.appName', 'Business Suite AI - IAM Service');
  const apiPrefix = configService.get<string>('app.apiGlobalPrefix', 'iam/api');
  const apiVersion = configService.get<string>('app.apiVersion', 'v1');

  const config = new DocumentBuilder()
    .setTitle(appName)
    .setDescription(`API documentation for the ${appName}`)
    .setVersion('1.0')
    .addServer(`/${apiPrefix}/${apiVersion}`)
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'jwt-auth',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(`${apiPrefix}/${apiVersion}/docs`, app, document, {
    swaggerOptions: { persistAuthorization: true },
    customSiteTitle: `${appName} - API Docs`,
  });
}
