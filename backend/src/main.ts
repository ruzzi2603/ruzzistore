import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import * as express from 'express';
import { applyHelmet } from './security/helmet';
import { applyRateLimit } from './security/rate-limit';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const jwtSecret = process.env.JWT_SECRET?.trim();

  if (!jwtSecret) {
    throw new Error('JWT_SECRET ausente. Defina a variavel de ambiente antes de iniciar o backend.');
  }

  const httpAdapter = app.getHttpAdapter();
  const instance = httpAdapter.getInstance() as express.Application;
  instance.set('trust proxy', 1);
  app.use(express.json({ limit: '5mb' }));
  app.use(express.urlencoded({ limit: '5mb', extended: true }));
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.use(cookieParser());
  applyHelmet(app);
  applyRateLimit(app);

  const frontendOrigins = (process.env.FRONTEND_URL || 'http://localhost:3000')
    .split(',')
    .map((o) => o.trim())
    .filter(Boolean);

  app.enableCors({
    origin: (origin, callback) => {
      if (!origin || frontendOrigins.includes(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error('Origem nao permitida por CORS'));
    },
    credentials: true,
  });

  const swaggerConfig = new DocumentBuilder()
    .setTitle('ArenaGames API')
    .setDescription('Documentacao da API do backend da ArenaGames')
    .setVersion('1.0.0')
    .addBearerAuth()
    .build();

  const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api-docs', app, swaggerDocument);

  const port = Number(process.env.PORT) || 3001;
  await app.listen(port);
}
bootstrap();

