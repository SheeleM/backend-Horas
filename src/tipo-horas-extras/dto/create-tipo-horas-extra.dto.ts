import { IsDecimal, IsInt, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateTipoHorasExtraDto {

    @IsInt()
    id: number;
  
    @IsString()
    @IsNotEmpty()
    nombre: string;
  
    @IsDecimal()
    @IsNotEmpty()
    factorMultiplicador: number;
  
    @IsString()
    @IsNotEmpty()
    formula: string;
  
    @IsString()
    @IsOptional()
    descripcion?: string;
  
    @IsNotEmpty()
    creado: Date;
  
    @IsOptional()
    actualizado?: Date;
}
