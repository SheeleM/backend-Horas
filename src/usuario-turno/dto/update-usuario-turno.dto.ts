import { PartialType } from '@nestjs/mapped-types';
import { CreateUsuarioTurnoDto } from './create-usuario-turno.dto';

export class UpdateUsuarioTurnoDto extends PartialType(CreateUsuarioTurnoDto) {}
