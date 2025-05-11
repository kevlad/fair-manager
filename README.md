# Business Suite AI - IAM Service

Identity and Access Management microservice for the Business Suite AI platform.

## Description

This service is responsible for:
- User authentication (login, registration, token issuance)
- User authorization (roles, permissions)
- Tenant context for users
- OAuth 2.0 / OIDC provider capabilities
- Multi-Factor Authentication (MFA)

Built with NestJS (Node.js, TypeScript).

## Prerequisites

- Node.js (v18 recommended)
- npm or yarn
- Docker
- MySQL

## Installation

```bash
npm install
```

## Running the app (Development)

1. Create a `.env.development` file based on `.env.example`.
2. Ensure your MySQL database is running and the schema is created/migrated.
   ```bash
   npm run migration:run     # If using TypeORM migrations
   ```
3. Start the development server:
   ```bash
   npm run start:dev
   ```

The service will be running on `http://localhost:3001`.

## API Documentation

Swagger docs at `http://localhost:<PORT>/iam/api/v1/docs`.

## Testing

```bash
npm run test
npm run test:e2e
npm run test:cov
```

## Docker

```bash
docker build -t bsa/iam-service .
docker run -p 3001:3001 --env-file .env.production bsa/iam-service
```

## License

Proprietary
