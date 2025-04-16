import { IsBoolean, IsInt, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateUsuarioTurnoDto {

// @IsInt()
  //idUsuarioTurno: number;

  @IsString()
  mes:string; 
  
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
