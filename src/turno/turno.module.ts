import { Module } from '@nestjs/common';
import { TurnoService } from './turno.service';
import { TurnoController } from './turno.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Turno } from './entities/turno.entity';
import { UsuarioTurno } from 'src/usuario-turno/entities/usuario-turno.entity';

@Module({
   imports:[TypeOrmModule.forFeature([Turno, UsuarioTurno])],
  controllers: [TurnoController],
  providers: [TurnoService],
})
export class TurnoModule {}
