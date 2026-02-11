import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ScraperCron {
  constructor(private prisma: PrismaService) {}

  async fetchFreeGames() {
    const url =
      'https://store-site-backend-static.ak.epicgames.com/freeGamesPromotions';

    const { data } = await axios.get(url);
    const games =
      data.data.Catalog.searchStore.elements;

    for (const game of games) {
      const isFree =
        game.price?.totalPrice?.discountPrice === 0;

      if (!isFree) continue;

      const gameUrl = `https://store.epicgames.com/p/${game.productSlug}`;

      await this.prisma.game.upsert({
        where: {
          platform_url: {
            platform: 'epic',
            url: gameUrl,
          },
        },
        update: {
          title: game.title,
          imageUrl: game.keyImages?.[0]?.url,
          platform: 'epic',
          isFree: true,
        },
        create: {
          title: game.title,
          description: game.description,
          imageUrl: game.keyImages?.[0]?.url,
          platform: 'epic',
          isFree: true,
          url: gameUrl,
        },
      });
    }
  }
}
