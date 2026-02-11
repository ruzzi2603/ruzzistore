import { INestApplication } from '@nestjs/common';
import rateLimit from 'express-rate-limit';

export function applyRateLimit(app: INestApplication) {
  app.use(
    rateLimit({
      windowMs: 60 * 1000,
      max: 120,
      standardHeaders: true,
      legacyHeaders: false,
    }),
  );
}
