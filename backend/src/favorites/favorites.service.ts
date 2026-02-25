import { BadRequestException, Injectable } from '@nestjs/common';
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
      const sanitizedTitle = String(game.title ?? 'Sem titulo').trim().slice(0, 191);
      const sanitizedDescription = game.description
        ? String(game.description).trim().slice(0, 4000)
        : null;
      const sanitizedImageUrl = game.imageUrl ? String(game.imageUrl).trim().slice(0, 500) : null;
      const sanitizedPlatform = String(game.platform).trim().slice(0, 40);
      const sanitizedUrl = String(game.url).trim().slice(0, 500);

      if (!sanitizedPlatform || !sanitizedUrl) {
        throw new BadRequestException('Dados do jogo invalidos para salvar favorito.');
      }

      const existingGame = await this.prisma.game.findUnique({
        where: {
          platform_url: {
            platform: sanitizedPlatform,
            url: sanitizedUrl,
          },
        },
      });

      if (existingGame) {
        resolvedGameId = existingGame.id;
      } else {
        const created = await this.prisma.game.create({
          data: {
            title: sanitizedTitle || 'Sem titulo',
            description: sanitizedDescription,
            imageUrl: sanitizedImageUrl,
            platform: sanitizedPlatform,
            isFree: Boolean(game.isFree),
            url: sanitizedUrl,
          },
        });
        resolvedGameId = created.id;
      }
    } else {
      const storedGame = await this.prisma.game.findUnique({
        where: { id: resolvedGameId },
        select: { id: true },
      });

      if (!storedGame) {
        throw new BadRequestException('Jogo nao encontrado para favoritar.');
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
