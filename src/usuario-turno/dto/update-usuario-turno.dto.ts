import { PartialType } from '@nestjs/mapped-types';
import { CreateUsuarioTurnoDto } from './create-usuario-turno.dto';
import { IsInt, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateUsuarioTurnoDto  extends PartialType(CreateUsuarioTurnoDto){


@IsInt()
  idUsuarioTurno: number;


  //@IsInt()
 // mes:number; 

  @Type(() => Number)  // Asegura la conversión a número
  @IsInt()
  turnoFK: number;

  @IsInt()
  usuarioFK: number;


  @IsNotEmpty()
  fechaInicio: Date;

  @IsNotEmpty()
  fechaFin: Date;




}
