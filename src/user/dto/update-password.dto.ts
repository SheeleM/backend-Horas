import { IsNumber, IsString, MinLength } from 'class-validator';

export class RecoverPasswordDto {
    
  @IsNumber()
  cedula: number;

  @IsString()
  respuestaSeguridad: string;

  @IsString()
  @MinLength(6)
  newPassword: string;
}
