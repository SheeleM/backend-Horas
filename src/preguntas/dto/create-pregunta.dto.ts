import { IsString } from "class-validator";

export class CreatePreguntaDto {

    
    @IsString()
    pregunta: string;

}
