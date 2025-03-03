import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class GetRolDto {
  @IsNumber()
  @IsNotEmpty()
  idRol: number;

  @IsString()
  @IsNotEmpty()
  nombre: string;
}