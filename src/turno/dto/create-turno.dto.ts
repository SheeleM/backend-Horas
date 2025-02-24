import { IsInt, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateTurnoDto {

    @IsInt()
    id: number;
  
    @IsString()
    @IsNotEmpty()
    codigo: string;
  
    @IsNotEmpty()
    horaInicio: string;
  
    @IsNotEmpty()
    horaFin: string;
  
    @IsNotEmpty()
    guardiaInicio: Date;
  
    @IsNotEmpty()
    guardiaFin: Date;
  
    @IsNotEmpty()
    creado: Date;
  
    @IsOptional()
    actualizado?: Date;

}
