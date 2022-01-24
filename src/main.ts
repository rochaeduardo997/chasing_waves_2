import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { TabuadeMareService } from './tabuaDeMare/tabuaDeMare.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(4000);
}
bootstrap();
