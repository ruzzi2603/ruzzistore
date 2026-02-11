import { Controller, Get, Query, Param } from '@nestjs/common';
import { GamesService } from './games.service';

@Controller('games')
export class GamesController {
  constructor(private readonly gamesService: GamesService) {}

  @Get()
  findAll(
    @Query('search') search?: string,
    @Query('category') category?: string,
    @Query('platform') platform?: string,
    @Query('free') free?: string,
    @Query('source') source?: string,
    @Query('page') page?: string,
  ) {
    return this.gamesService.findAll({
      search,
      category,
      platform,
      free: free === 'true',
      source,
      page: page ? Number(page) : undefined,
    });
  }

  @Get('rawg-latest')
  getRawgLatest(@Query('count') count?: string) {
    const total = count ? Number(count) : 40;
    return this.gamesService.getRawgLatest(total);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.gamesService.findById(Number(id));
  }
}
