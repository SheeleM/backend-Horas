import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TurnoService } from './turno.service';
import { TurnoController } from './turno.controller';
import { Turno } from './entities/turno.entity';
import { UsuarioTurno } from 'src/usuario-turno/entities/usuario-turno.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Turno, UsuarioTurno])],
  controllers: [TurnoController],
  providers: [TurnoService],
  exports: [TypeOrmModule, TurnoService] // Exportar TypeOrmModule para que otros módulos puedan usar el repositorio
})
export class TurnoModule {}
