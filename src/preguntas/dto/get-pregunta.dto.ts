import { IsNumber, IsString } from "class-validator";


export class GetPreguntaDto {
    @IsNumber()
    id: number;
    @IsString()
    pregunta: string;
}
