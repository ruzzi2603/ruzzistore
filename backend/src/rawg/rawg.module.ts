import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { RawgService } from './rawg.service';
import { RawgController } from './rawg.controller';

@Module({
  imports: [HttpModule],
  providers: [RawgService],
  controllers: [RawgController],
  exports: [RawgService],
})
export class RawgModule {}
