import {
  IsDecimal,
  IsInt,
  IsNotEmpty,

  IsString,
} from 'class-validator';

export class CreateTipoHorasExtraDto {


  @IsString()
  @IsNotEmpty()
  codigoHoraExtra: string;

  @IsString()
  @IsNotEmpty()
  descripcion: string;

  @IsNotEmpty()
  horaInicio: Date;
  
  @IsNotEmpty()
  horaFin: Date;


}
