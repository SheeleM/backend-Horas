import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateRolDto {

  @IsString()
  @IsNotEmpty()
  nombre: string;

  @IsString()
  @IsOptional()
  descripcion?: string;

  @IsNotEmpty()
  creacion: Date;

  @IsOptional()
  actualizado?: Date;
}
