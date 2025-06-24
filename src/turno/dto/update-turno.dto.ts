import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateTurnoDto {
  @IsString()
  @IsNotEmpty()
  codigo: string;

  @IsString()
  @IsNotEmpty()
  nombre: string;

  @IsNotEmpty()
  horaInicio: string;

  @IsNotEmpty()
  horaFin: string;

  @IsString()
  @IsNotEmpty()
  diaInicio: string;

  @IsString()
  @IsNotEmpty()
  diaFin: string;

    @IsOptional()
    @IsBoolean()
    guardia?:boolean;

      @IsOptional()
  @IsBoolean()
  activo?:boolean;
}
