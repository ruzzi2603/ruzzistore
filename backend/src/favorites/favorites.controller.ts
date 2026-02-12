import { Controller, Get, Post, Param, UseGuards, Req, Body } from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('favorites')
@UseGuards(JwtAuthGuard)
// AQUI: Verifique se o 'export' está presente e o nome está EXATAMENTE assim
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Get('ids')
  async getMyFavoriteIds(@Req() req: any) {
    const userId = Number(req.user.userId);
    return this.favoritesService.getUserFavoriteIds(userId);
  }

  @Get()
  async getMyFavorites(@Req() req: any) {
    const userId = Number(req.user.userId);
    return this.favoritesService.getUserFavorites(userId);
  }

  @Post(':gameId')
  async toggle(@Req() req: any, @Param('gameId') gameId: string, @Body() body: any) {
    const userId = Number(req.user.userId);
    const gId = Number(gameId);
    return this.favoritesService.toggleFavorite(userId, gId, body?.game);
  }
}
