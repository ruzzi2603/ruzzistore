import { Injectable } from '@nestjs/common';

@Injectable()
export class JwtConfig {
secret: string = process.env.JWT_SECRET || '';

  expiresIn: string = process.env.JWT_EXPIRES_IN || '7d';
}