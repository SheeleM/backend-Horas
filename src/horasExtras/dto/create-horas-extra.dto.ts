import { IsDecimal, IsEnum, IsInt, IsNotEmpty, IsOptional, IsString, Matches } from "class-validator";
import { EstadoHoraExtra } from "../entities/horas-extra.entity";

export class CreateHorasExtraDto {

  @IsNotEmpty()
  fecha: Date;

  // Cambia el tipo de ticket de number a string para que coincida con la entidad HorasExtra
  @IsNotEmpty()
  ticket: string;

  @IsNotEmpty()
    @IsString()
      @Matches(/^([0-1]\d|2[0-3]):([0-5]\d)$/, {
        message: 'horaInicio debe tener formato HH:mm'
      })
  horaInicio: string;

  @IsNotEmpty()
    @IsString()
      @Matches(/^([0-1]\d|2[0-3]):([0-5]\d)$/, {
    message: 'horaInicio debe tener formato HH:mm'
  })
  horaFin: string;

    estado?: EstadoHoraExtra;


}
