import { INestApplication } from '@nestjs/common';
import helmet from 'helmet';

export function applyHelmet(app: INestApplication) {
  app.use(
    helmet({
      contentSecurityPolicy: false,
      crossOriginEmbedderPolicy: false,
    }),
  );
}
