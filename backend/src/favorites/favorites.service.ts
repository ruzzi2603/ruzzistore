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

  async toggleFavorite(userId: number, gameId: number, game?: any) {
    let resolvedGameId = gameId;

    if (game?.url && game?.platform) {
      const existingGame = await this.prisma.game.findUnique({
        where: {
          platform_url: {
            platform: String(game.platform),
            url: String(game.url),
          },
        },
      });

      if (existingGame) {
        resolvedGameId = existingGame.id;
      } else {
        const created = await this.prisma.game.create({
          data: {
            title: String(game.title ?? 'Sem titulo'),
            description: game.description ? String(game.description) : null,
            imageUrl: game.imageUrl ? String(game.imageUrl) : null,
            platform: String(game.platform),
            isFree: Boolean(game.isFree),
            url: String(game.url),
          },
        });
        resolvedGameId = created.id;
      }
    }

    const existing = await this.prisma.favorite.findUnique({
      where: {
        userId_gameId: { userId, gameId: resolvedGameId },
      },
    });

    if (existing) {
      return this.prisma.favorite.delete({
        where: {
          userId_gameId: { userId, gameId: resolvedGameId },
        },
      });
    }

    return this.prisma.favorite.create({
      data: { userId, gameId: resolvedGameId },
    });
  }
}
