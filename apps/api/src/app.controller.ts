import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { PrismaService } from './prisma.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly prisma: PrismaService,
  ) { }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('health')
  async health() {
    return {
      status: 'ok',
      db: this.prisma.isOffline ? 'db-offline' : 'connected',
      timestamp: new Date().toISOString(),
    };
  }
}
