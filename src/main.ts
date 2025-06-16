import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { JwtAuthGuard } from './login/JwtAuthGuard';
import * as session from 'express-session'

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api/v1');

   // 👉 Sesiones habilitadas
   app.use(
    session({
      secret: 'my-secret', // Usa una clave secreta segura en producción
      resave: false, // No guarda la sesión si no fue modificada.
      saveUninitialized: false, // No guarda sesiones nuevas vacías.
      cookie: {
        maxAge: 1000 * 60 * 60, // las sesiones duran 1 hora
      },
    }),
  );



  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true, //transforma automaticamente los datos
    }),
  );
  app.enableCors({
//origin: 'http://localhost:4200', // Permitir solicitudes solo desde Angular
//origin: 'https://vrbstm5m-4200.use2.devtunnels.ms', // Permitir solicitudes solo desde Angular
 // origin:  'https://vrbstm5m-4200.use2.devtunnels.ms', // HTTPS
  //   'http://vrbstm5m-4200.use2.devtunnels.ms'  // HTTP por si acaso
  origin: [
    '*'
 //   'https://vrbstm5m-4200.use2.devtunnels.ms', // HTTPS
  //  'http://vrbstm5m-4200.use2.devtunnels.ms',  // HTTP por si acaso
   // 'http://localhost:4200',
    // 'http://20.57.139.111:3000' // Para desarrollo local
  ],

 // origin: 'https://front-horas-two.vercel.app', // Permitir solicitudes solo desde Angular
  
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS','PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true, // Permite cookies o tokens en las cabeceras
  });
  const reflector = app.get(Reflector);
  app.useGlobalGuards(new JwtAuthGuard(reflector));
  await app.listen(process.env.PORT ?? 3000);

}
bootstrap();
