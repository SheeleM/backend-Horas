import { Type } from 'class-transformer';
import { IsInt, IsPositive, IsString, MinLength } from 'class-validator';

export class GetUserDto {
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  id: number;

  @IsString()
  @MinLength(1)
  fullname: string;

  @Type(() => Number)
  @IsInt()
  @IsPositive()
  cedula: number;
//hola
  estado: boolean;

  @Type(() => Object)
  rol: { idRol: number; nombre: string } | null;

  constructor(user: any) {
    this.id = user.id;
    this.fullname = user.fullname;
    this.cedula = user.cedula;
    this.estado = user.estado;
    this.rol = user.rol
      ? { idRol: user.rol.idRol, nombre: user.rol.nombre }
      : null;
  }
}
