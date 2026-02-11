import { Module } from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { FavoritesController } from './favorites.controller';
import { PrismaService } from '../prisma/prisma.service'; // Ajuste o caminho se necessário

@Module({
  controllers: [FavoritesController],
  providers: [FavoritesService, PrismaService],
  exports: [FavoritesService], // Exportamos caso você precise usar em outros módulos no futuro
})
export class FavoritesModule {}