import {  IsInt, IsString } from "class-validator";


export class GetAsignacionTurnoDto {
    

    @IsString()
    codigo: string;

    @IsInt()
    IdTurno:number;
}
