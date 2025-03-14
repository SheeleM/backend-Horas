import {
  IsNotEmpty,
  IsString
} from 'class-validator';

export class CreateTurnoDto {
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
}
