import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api/v1');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true, //transforma automaticamente los datos
    }),
  );
  app.enableCors({
  // origin: 'http://localhost:4200', // Permitir solicitudes solo desde Angular
    origin: 'https://front-horas-two.vercel.app', // Permitir solicitudes solo desde Angular

    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true, // Permite cookies o tokens en las cabeceras
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
