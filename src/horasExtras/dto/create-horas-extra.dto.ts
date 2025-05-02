import { IsDecimal, IsEnum, IsInt, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateHorasExtraDto {

  @IsNotEmpty()
  fecha: Date;

  // Cambia el tipo de ticket de number a string para que coincida con la entidad HorasExtra
  @IsNotEmpty()
  ticket: string;

  @IsNotEmpty()
  horaInicio: Date;

  @IsNotEmpty()
  horaFin: Date;

}
