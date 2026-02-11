import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class RawgService {
  private readonly baseUrl = 'https://api.rawg.io/api';
  private readonly apiKey = process.env.RAWG_API_KEY;

  constructor(private readonly http: HttpService) {}

  async getGames(page = 1, pageSize = 100, ordering?: string) {
    const response = await firstValueFrom(
      this.http.get(`${this.baseUrl}/games`, {
        params: {
          key: this.apiKey,
          page,
          page_size: pageSize,
          ...(ordering ? { ordering } : {}),
        },
      }),
    );

    return response.data;
  }
}
