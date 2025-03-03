import { IsInt, IsNotEmpty, IsPositive, IsString } from 'class-validator';
export class CreateLoginDto {

  @IsNotEmpty({ message: 'La cédula es requerida' })
  @IsInt()
  @IsPositive()
  cedula: number;

  @IsNotEmpty({ message: 'La contraseña es requerida' })
  @IsString({ message: 'La contraseña debe ser un texto' })
  password: string;

}
