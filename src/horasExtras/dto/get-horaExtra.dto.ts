import { IsDecimal, IsEnum, IsInt, IsNotEmpty, IsOptional, IsString, Matches } from "class-validator";

export class GetHorasExtraDto {

  @IsNotEmpty()
  fecha: Date;

  // Cambia el tipo de ticket de number a string para que coincida con la entidad HorasExtra
  @IsNotEmpty()
  ticket: string;

    @IsNotEmpty()
    @IsString()
    horaInicio: string;

    @IsNotEmpty()
    @IsString()
      horaFin: string;

    @IsOptional()
    @IsInt()
    cantidadHoras?: number | null;

    @IsOptional()
    @IsString()
    descripcion?: string;


}
