import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@repo/db';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy {
  public isOffline = false;

  async onModuleInit() {
    try {
      await this.$connect();
      this.isOffline = false;
    } catch (error) {
      this.isOffline = true;
      console.warn(
        'Database connection failed. Running in offline/dummy mode.',
      );
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
