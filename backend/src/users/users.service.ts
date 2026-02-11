import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async updateName(userId: number, name: string) {
    return this.prisma.user.update({
      where: { id: userId },
      data: { name },
      select: { id: true, name: true, email: true, avatar: true },
    });
  }

  async updateAvatar(userId: number, avatar: string | null) {
    return this.prisma.user.update({
      where: { id: userId },
      data: { avatar },
      select: { id: true, name: true, email: true, avatar: true, createdAt: true },
    });
  }

  async listUsers() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        avatar: true,
        createdAt: true,
        lastLoginAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}
