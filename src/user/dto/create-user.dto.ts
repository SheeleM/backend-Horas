import { Type } from "class-transformer";
import { IsInt, IsOptional, IsPositive, IsString, MinLength } from "class-validator";

export class CreateUserDto {
    @IsString()
    @MinLength(1)
    fullname: string;

    @Type(() => Number)
    @IsInt()
    @IsPositive()
    cedula: number;

    @IsString()
    password: string;

    @Type(() => Number)
    @IsInt()
    @IsPositive()
    preguntas: number;

    @IsString()
    respuestaSeguridad: string;
}
