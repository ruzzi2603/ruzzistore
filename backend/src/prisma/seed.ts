import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.game.upsert({
    where: {
      platform_url: {
        platform: 'epic',
        url: 'https://www.epicgames.com/fortnite',
      },
    },
    update: {},
    create: {
      title: 'Fortnite',
      platform: 'epic',
      isFree: true,
      url: 'https://www.epicgames.com/fortnite',
      imageUrl:
        'https://cdn2.unrealengine.com/fortnite-og-social-1920x1080-1920x1080-6f1bcd3b9bfa.jpg',
    },
  });
}

main()
  .finally(async () => {
    await prisma.$disconnect();
  });
