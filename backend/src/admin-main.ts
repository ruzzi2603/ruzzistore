import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import * as express from 'express';
import { applyHelmet } from './security/helmet';
import { applyRateLimit } from './security/rate-limit';
import { AdminModule } from './admin/admin.module';

async function bootstrap() {
  const app = await NestFactory.create(AdminModule);

  app.use(express.json({ limit: '5mb' }));
  app.use(express.urlencoded({ limit: '5mb', extended: true }));

  app.use(cookieParser());
  applyHelmet(app);
  applyRateLimit(app);

  const adminOrigins = (process.env.ADMIN_FRONTEND_URL || 'http://localhost:3003')
    .split(',')
    .map((o) => o.trim())
    .filter(Boolean);

  app.enableCors({
    origin: adminOrigins,
    credentials: true,
  });

  await app.listen(3002);
}
bootstrap();
