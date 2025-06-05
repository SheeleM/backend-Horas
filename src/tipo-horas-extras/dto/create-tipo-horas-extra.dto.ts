import {
  IsDecimal,
  IsInt,
  IsNotEmpty,

  IsOptional,

  IsString,
  Matches,
} from 'class-validator';

export class CreateTipoHorasExtraDto {


  @IsString()
  @IsNotEmpty()
  codigoHoraExtra: string;

  @IsString()
  @IsNotEmpty()
  descripcion: string;

 // @IsNotEmpty()
 // horaInicio: string;
   @IsString()
  @IsNotEmpty()
  @Matches(/^([0-1]\d|2[0-3]):([0-5]\d)$/, {
    message: 'horaInicio debe tener formato HH:mm'
  })
  horaInicio: string; // Ej: '14:30'

  
  @IsString()
  @IsNotEmpty()
  @Matches(/^([0-1]\d|2[0-3]):([0-5]\d)$/, {
    message: 'horaFin debe tener formato HH:mm'
  })
  horaFin: string;

    @IsString()
  @IsOptional()
  @Matches(/^([0-1]\d|2[0-3]):([0-5]\d)$/, {
    message: 'horaInicio2 debe tener formato HH:mm'
  })
  horaInicio2?: string;
  
  @IsString()
  @IsOptional()
  @Matches(/^([0-1]\d|2[0-3]):([0-5]\d)$/, {
    message: 'horaFin2 debe tener formato HH:mm'
  })
  horaFin2 ?:string;



}
