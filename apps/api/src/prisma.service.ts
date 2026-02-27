import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@repo/db';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  async onModuleInit() {
    try {
      await this.$connect();
    } catch {
      console.warn(
        'Database connection failed. Running in offline/dummy mode.',
      );
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
