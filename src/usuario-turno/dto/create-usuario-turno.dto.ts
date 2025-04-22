import { Type } from "class-transformer";
import { IsBoolean, IsInt, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateUsuarioTurnoDto {

// @IsInt()
  //idUsuarioTurno: number;

 // @IsInt()
  //mes:number; 

  @Type(() => Number)  // Asegura la conversión a número
  @IsInt()
  turnoFK: number;

  @IsInt()
  usuarioFK: number;


  @IsNotEmpty()
  fechaInicio: Date;
  

  @IsNotEmpty()
  fechaFin: Date;

  //@IsBoolean()
  //activo: boolean;

  //@IsNotEmpty()
  //creado: Date;

  //@IsOptional()
  //actualizado?: Date;
}
