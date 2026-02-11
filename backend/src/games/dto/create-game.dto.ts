export class CreateGameDto {
  title: string;
  description?: string;
  imageUrl?: string;
  platform: string;
  isFree: boolean;
  url: string;
  categoryIds?: number[];
}
