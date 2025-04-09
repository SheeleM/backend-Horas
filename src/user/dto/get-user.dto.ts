import { Transform, Type } from 'class-transformer';
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

  constructor(partial: Partial<GetUserDto>) {
    this.id = partial.id !== undefined ? Number(partial.id) : 0; // Asigna 0 si id es undefined o null.
    this.fullname = partial.fullname ?? '';
    this.cedula = partial.cedula !== undefined ? Number(partial.cedula) : 0; // Asigna 0 si cedula es undefined o null.
    this.estado =
      partial.estado !== undefined ? Boolean(partial.estado) : false; // Asigna false si estado es undefined.
    this.rol = partial.rol
      ? {
          idRol:
            partial.rol.idRol !== undefined ? Number(partial.rol.idRol) : 0, // Asigna 0 si idRol es undefined.
          nombre: partial.rol.nombre ?? '', // Asigna una cadena vacía si nombre es undefined.
        }
      : null;
  }
}
