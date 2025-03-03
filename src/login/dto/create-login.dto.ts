import { IsNotEmpty, IsString } from 'class-validator';
export class CreateLoginDto {

    @IsNotEmpty({ message: 'La cédula es requerida' })
  @IsString({ message: 'La cédula debe ser un texto' })
  cedula: string;

  @IsNotEmpty({ message: 'La contraseña es requerida' })
  @IsString({ message: 'La contraseña debe ser un texto' })
  password: string;

}
