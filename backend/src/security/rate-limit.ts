import { INestApplication } from '@nestjs/common';
import rateLimit from 'express-rate-limit';

export function applyRateLimit(app: INestApplication) {
  const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
      statusCode: 429,
      message: 'Muitas tentativas de autenticacao. Tente novamente em alguns minutos.',
    },
  });

  app.use('/auth/login', authLimiter);
  app.use('/auth/register', authLimiter);

  app.use(
    rateLimit({
      windowMs: 60 * 1000,
      max: 120,
      standardHeaders: true,
      legacyHeaders: false,
    }),
  );
}
