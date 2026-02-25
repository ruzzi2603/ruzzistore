import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { RawgService } from './rawg.service';

@Controller('rawg')
export class RawgController {
  constructor(private readonly rawgService: RawgService) {}

  @Get('games')
  async listGames(
    @Query('page') page = '1',
  ) {
    return this.rawgService.getGames(Number(page));
  }

  @Get('games/:id')
  async getGameDetails(@Param('id', ParseIntPipe) id: number) {
    return this.rawgService.getGameById(id);
  }

  @Get('games/:id/movies')
  async getGameMovies(@Param('id', ParseIntPipe) id: number) {
    return this.rawgService.getGameMovies(id);
  }

  @Get('games/:id/twitch')
  async getGameTwitchStreams(@Param('id', ParseIntPipe) id: number) {
    return this.rawgService.getGameTwitchStreams(id);
  }

  @Get('games/:id/youtube')
  async getGameYoutubeVideos(@Param('id', ParseIntPipe) id: number) {
    return this.rawgService.getGameYoutubeVideos(id);
  }
}
