import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RawgService } from '../rawg/rawg.service';

@Injectable()
export class GamesService {
  constructor(
    private prisma: PrismaService,
    private rawgService: RawgService,
  ) {}

  async findAll(filters: {
    search?: string;
    category?: string;
    platform?: string;
    free?: boolean;
    source?: string;
    page?: number;
  }) {
    if (filters.source === 'rawg') {
      let results: any[] = [];
      try {
        const data = await this.rawgService.getGames(filters.page ?? 1);
        results = Array.isArray(data?.results) ? data.results : [];
      } catch {
        // If RAWG is unavailable, return empty list instead of 500
        return [];
      }

      // Do NOT sync to DB on request to avoid exhausting the connection pool.
      return results.map((item: any) => {
        const slug = item?.slug || String(item?.id || 'rawg');
        return {
          id: item?.id || slug,
          title: item?.name || 'Sem titulo',
          imageUrl: item?.background_image || null,
          platform: 'rawg',
          url: `https://rawg.io/games/${slug}`,
          isFree: false,
        };
      });
    }

    return this.prisma.game.findMany({
      where: {
        title: filters.search
          ? { contains: filters.search }
          : undefined,

        platform: filters.platform,

        isFree: filters.free,

        categories: filters.category
          ? {
              some: {
                category: {
                  name: filters.category,
                },
              },
            }
          : undefined,
      },
      include: {
        categories: {
          include: { category: true },
        },
      },
    });
  }

  findById(id: number) {
    return this.prisma.game.findUnique({
      where: { id },
      include: {
        categories: {
          include: { category: true },
        },
      },
    });
  }

  async getRawgLatest(count = 40) {
    const data = await this.rawgService.getGames(1, count, '-released');
    const results = Array.isArray(data?.results) ? data.results : [];

    const upserts = results.map((item: any) => {
      const slug = item?.slug || String(item?.id || 'rawg');
      const url = `https://rawg.io/games/${slug}`;

      return this.prisma.game.upsert({
        where: {
          platform_url: {
            platform: 'rawg',
            url,
          },
        },
        create: {
          title: item?.name || 'Sem titulo',
          description: item?.released ? `Lancamento: ${item.released}` : null,
          imageUrl: item?.background_image || null,
          platform: 'rawg',
          url,
          isFree: false,
        },
        update: {
          title: item?.name || 'Sem titulo',
          imageUrl: item?.background_image || null,
        },
      });
    });

    return Promise.all(upserts);
  }

  private async syncRawgGames(page: number) {
    const data = await this.rawgService.getGames(page);
    const results = Array.isArray(data?.results) ? data.results : [];
    if (results.length === 0) return;

    const upserts = results.map((item: any) => {
      const slug = item?.slug || String(item?.id || 'rawg');
      const url = `https://rawg.io/games/${slug}`;

      return this.prisma.game.upsert({
        where: {
          platform_url: {
            platform: 'rawg',
            url,
          },
        },
        create: {
          title: item?.name || 'Sem titulo',
          description: item?.released ? `Lancamento: ${item.released}` : null,
          imageUrl: item?.background_image || null,
          platform: 'rawg',
          url,
          isFree: false,
        },
        update: {
          title: item?.name || 'Sem titulo',
          imageUrl: item?.background_image || null,
        },
      });
    });

    const chunkSize = 5;
    for (let i = 0; i < upserts.length; i += chunkSize) {
      // Avoid exhausting the Prisma connection pool on small instances
      await Promise.all(upserts.slice(i, i + chunkSize));
    }
  }
}
