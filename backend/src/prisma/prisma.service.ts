import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  async onModuleInit() {
    await this.$connect();
  }

  async enableShutdownHooks() {
    // NÃO usar $on('beforeExit') no Prisma v5
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
