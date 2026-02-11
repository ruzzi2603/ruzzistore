import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

/* Prisma */
import { PrismaModule } from './prisma/prisma.module';

/* Auth / JWT */
import { AuthModule } from './auth/auth.module';

/* Dominio */
import { GamesModule } from './games/games.module';
import { CategoriesModule } from './categories/categories.module';
import { UsersModule } from './users/users.module';
import { FavoritesModule } from './favorites/favorites.module';

/* RAWG API */
import { RawgModule } from './rawg/rawg.module';

/* Scraper / Cron */
import { ScraperModule } from './scraper/scraper.module';

@Module({
  imports: [
    // Variaveis de ambiente (.env)
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    // Banco de dados
    PrismaModule,

    // Autenticacao
    AuthModule,

    // Dominio principal
    GamesModule,
    CategoriesModule,
    UsersModule,
    FavoritesModule,

    // Integracoes externas
    RawgModule,

    // Scraper + tarefas agendadas
    ScraperModule,
  ],
})
export class AppModule {}
