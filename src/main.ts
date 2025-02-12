import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import { ZodFilter } from './common/filter/zod-filter/zod.filter';
import { UnauthorizedExceptionFilter } from './common/filter/unauthorized-exception/unauthorized-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Set Global Exception Filter
  app.useGlobalFilters(new ZodFilter(), new UnauthorizedExceptionFilter());

  // Set Global Prefix
  app.setGlobalPrefix('api');

  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
