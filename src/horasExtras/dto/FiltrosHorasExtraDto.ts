import { IsArray, IsDateString, IsEnum, IsOptional } from 'class-validator';
import { EstadoHoraExtra } from '../entities/horas-extra.entity';

export class FiltrosHorasExtraDto {
  @IsDateString()
  fechaDesde: Date;

  @IsDateString()
  fechaHasta: Date;

  @IsOptional()
  @IsArray()
  estados?: EstadoHoraExtra[];
}
