import { PartialType } from '@nestjs/mapped-types';
import { CreateAsignacionTurnoDto } from './create-asignacion-turno.dto';

export class UpdateAsignacionTurnoDto extends PartialType(CreateAsignacionTurnoDto) {}
