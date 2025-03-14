import { PartialType } from '@nestjs/mapped-types';
import { CreateTurnoDto } from './create-turno.dto';
import { IsDate, IsInt, IsNotEmpty, IsString } from 'class-validator';

export class UpdateTurnoDto extends PartialType(CreateTurnoDto) {
  @IsInt()
  id: number;

  @IsString()
  @IsNotEmpty()
  codigo: string;

  @IsString()
  @IsNotEmpty()
  nombre: string;

  @IsNotEmpty()
  @IsString()
  horaInicio: string;

  @IsNotEmpty()
  @IsString()
  horaFin: string;

  @IsString()
  @IsNotEmpty()
  diaInicio: string;

  @IsString()
  @IsNotEmpty()
  diaFin: string;
}
