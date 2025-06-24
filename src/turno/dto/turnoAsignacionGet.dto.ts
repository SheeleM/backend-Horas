import {  IsBoolean, IsInt, IsOptional, IsString } from "class-validator";


export class GetAsignacionTurnoDto {
    

    @IsString()
    codigo: string;

    @IsInt()
    IdTurno:number;

    
        @IsOptional()
      @IsBoolean()
      activo?:boolean;
}
