import { IsDecimal, IsEnum, IsInt, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateHorasExtraDto {

    @IsInt()
    id: number;
  
    @IsInt()
    id_usuarioTurno: number;
  
    @IsInt()
    id_tipo_hora_extra: number;
  
    @IsNotEmpty()
    hora_inicio: string;
  
    @IsString()
    @IsOptional()
    descripcion?: string;
  
    @IsEnum(['PENDIENTE', 'APROBADO', 'RECHAZADO'])
    estado: string;
  
    @IsDecimal()
    @IsNotEmpty()
    valorHoraCreacion: number;
  
    @IsNotEmpty()
    fecha_actualizacion: Date;

}
