import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();
    const adminEmail = process.env.ADMIN_EMAIL;

    if (!adminEmail) {
      throw new ForbiddenException('ADMIN_EMAIL nao configurado');
    }

    if (!req?.user?.email || req.user.email !== adminEmail) {
      throw new ForbiddenException('Acesso negado');
    }

    return true;
  }
}
