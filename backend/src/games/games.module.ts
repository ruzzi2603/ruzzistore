import { Module } from '@nestjs/common';
import { GamesService } from './games.service';
import { GamesController } from './games.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { RawgModule } from '../rawg/rawg.module';

@Module({
  imports: [PrismaModule, RawgModule],
  controllers: [GamesController],
  providers: [GamesService],
})
export class GamesModule {}
