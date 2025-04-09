import {
    IsString,
    IsNotEmpty,
    MinLength,
    MaxLength,
    Matches,
  } from 'class-validator';
  
  export class CreateUsuarioDto {
    @IsString()
    @IsNotEmpty()
    @MinLength(3)
    fullname: string;
  
    @IsString()
    @IsNotEmpty()
    @MinLength(6)
    @MaxLength(10)
    @Matches(/^[0-9]{6,10}$/, { message: 'La cédula debe tener entre 6 y 10 dígitos numéricos.' })
    cedula: string;
  
    @IsString()
    @IsNotEmpty()
    password: string;
  
    @IsString()
    @IsNotEmpty()
    confirmPassword: string;
  
    @IsString()
    @IsNotEmpty()
    preguntas: string;
  
    @IsString()
    @IsNotEmpty()
    @MinLength(3)
    respuestaSeguridad: string;
  }
  