import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsuarioTurnoService } from './usuario-turno.service';
import { UsuarioTurnoController } from './usuario-turno.controller';
import { UsuarioTurno } from './entities/usuario-turno.entity';
import { Turno } from '../turno/entities/turno.entity';
import { User } from '../user/entities/user.entity';
import { TurnoModule } from '../turno/turno.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([UsuarioTurno, Turno, User]),
    TurnoModule,
    UserModule
  ],
  controllers: [UsuarioTurnoController],
  providers: [UsuarioTurnoService],
  exports: [UsuarioTurnoService, TypeOrmModule]
})
export class UsuarioTurnoModule {}
