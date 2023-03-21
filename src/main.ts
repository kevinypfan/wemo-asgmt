import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configBuilder = new DocumentBuilder()
    .setTitle('Wemo assignment')
    .setDescription('Wemo rent scooter backend assignment')
    .setVersion('0.0.1')
    .addBearerAuth();

  if (process.env.NODE_ENV === 'production')
    configBuilder.addServer(process.env.ENDPOINT_URL);

  const config = configBuilder.build();

  app.useGlobalPipes(new ValidationPipe());
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
}
bootstrap();
