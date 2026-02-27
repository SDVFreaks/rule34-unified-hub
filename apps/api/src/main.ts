import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import { GlobalExceptionFilter } from './common/filters/http-exception.filter';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.useGlobalFilters(new GlobalExceptionFilter());
  await app.listen(4000);
}
bootstrap().catch((err) => {
  console.error('Failed to start application:', err);
});
