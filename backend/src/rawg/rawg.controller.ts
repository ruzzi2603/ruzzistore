import { Controller, Get, Query } from '@nestjs/common';
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
}
