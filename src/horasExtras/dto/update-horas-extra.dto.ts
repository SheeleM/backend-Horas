import { PartialType } from '@nestjs/mapped-types';
import { CreateHorasExtraDto } from './create-horas-extra.dto';
import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { EstadoHoraExtra } from '../entities/horas-extra.entity';

export class UpdateHorasExtraDto  {

   //   @IsInt()
 // idUsuarioTurno: number;

  @IsOptional()
  fecha?: Date;

  @IsOptional()
  @IsString()
  ticket?: string;
  // Agregar estos campos opcionales que estás enviando desde el frontend
  @IsOptional()
  @IsString()
  horaInicio?: string;

  @IsOptional()
  @IsString()
  horaFin?: string;

    estado?: EstadoHoraExtra;

}
