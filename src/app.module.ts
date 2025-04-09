import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TurnoModule } from './turno/turno.module';
import { HorasExtrasModule } from './horasExtras/horas-extras.module';
import { TipoHorasExtrasModule } from './tipo-horas-extras/tipo-horas-extras.module';
import { AprobacionesModule } from './aprobaciones/aprobaciones.module';
import { DetalleHoraExtrasModule } from './detalle-hora-extras/detalle-hora-extras.module';
import { UsuarioTurnoModule } from './usuario-turno/usuario-turno.module';
import { RolModule } from './rol/rol.module';
import { LoginModule } from './login/login.module';
import { PreguntasModule } from './preguntas/preguntas.module';
import { AsignacionTurnoModule } from './asignacion-turno/asignacion-turno.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '123456789',
      database: 'horasextra',
      autoLoadEntities:true,
      synchronize: true,
    }),
    TurnoModule,
    HorasExtrasModule,
    TipoHorasExtrasModule,
    AprobacionesModule,
    DetalleHoraExtrasModule,
    UsuarioTurnoModule,
    RolModule,
    LoginModule,
    UserModule,
    PreguntasModule,
    AsignacionTurnoModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}


// TypeOrmModule.forRoot({
//   type: 'mysql',
//   host: 'bijwuurdjvy1uz5oy463-mysql.services.clever-cloud.com',
//   port: 3306,
//   username: 'uep3pwbt2l3sgmiv',
//   password: 's0zGJt0zI1akbBtnIXn9',
//   database: 'bijwuurdjvy1uz5oy463',
//   autoLoadEntities:true,
//   synchronize: true,
// }),