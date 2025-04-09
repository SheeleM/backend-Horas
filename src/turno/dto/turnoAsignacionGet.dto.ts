import {  IsString } from "class-validator";


export class GetAsignacionTurnoDto {
    

    @IsString()
    codigo: string;
}
