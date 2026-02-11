import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class FavoritesService {
  constructor(private prisma: PrismaService) {}

  // Verifique se o nome é EXATAMENTE getUserFavoriteIds
  async getUserFavoriteIds(userId: number) {
    const favorites = await this.prisma.favorite.findMany({
      where: { userId },
      select: { gameId: true },
    });
    return favorites.map((f) => f.gameId);
  }

  async getUserFavorites(userId: number) {
    const favorites = await this.prisma.favorite.findMany({
      where: { userId },
      include: { game: true },
    });
    return favorites.map((favorite) => favorite.game);
  }

  async toggleFavorite(userId: number, gameId: number) {
    const existing = await this.prisma.favorite.findUnique({
      where: {
        userId_gameId: { userId, gameId },
      },
    });

    if (existing) {
      return this.prisma.favorite.delete({
        where: {
          userId_gameId: { userId, gameId },
        },
      });
    }

    return this.prisma.favorite.create({
      data: { userId, gameId },
    });
  }
}
