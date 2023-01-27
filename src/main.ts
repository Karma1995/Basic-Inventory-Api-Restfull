import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AllExceptionFilter } from './filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  //Exceptions Filters
  app.useGlobalFilters(new AllExceptionFilter());

  await app.listen(3000);
}
bootstrap();
