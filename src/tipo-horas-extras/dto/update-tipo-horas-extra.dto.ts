import { PartialType } from '@nestjs/mapped-types';
import { CreateTipoHorasExtraDto } from './create-tipo-horas-extra.dto';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateTipoHorasExtraDto extends PartialType(CreateTipoHorasExtraDto) {



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
