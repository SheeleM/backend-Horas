import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Column } from 'typeorm';

export class CreateTurnoDto {
  @Column({ unique: true })
  @IsString()
  @IsNotEmpty()
  codigo: string;

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

  @IsOptional()
  @IsBoolean()
  guardia?:boolean;

    @IsOptional()
  @IsBoolean()
  activo?:boolean;


}
