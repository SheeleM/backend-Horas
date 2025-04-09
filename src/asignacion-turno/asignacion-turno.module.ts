import { Module } from '@nestjs/common';
import { AsignacionTurnoService } from './asignacion-turno.service';
import { AsignacionTurnoController } from './asignacion-turno.controller';

@Module({
  controllers: [AsignacionTurnoController],
  providers: [AsignacionTurnoService],
})
export class AsignacionTurnoModule {}
