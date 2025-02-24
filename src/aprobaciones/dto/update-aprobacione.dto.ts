import { PartialType } from '@nestjs/mapped-types';
import { CreateAprobacioneDto } from './create-aprobacione.dto';
import { IsEnum, IsInt, IsOptional, IsString } from 'class-validator';

export class UpdateAprobacioneDto extends PartialType(CreateAprobacioneDto) {

    @IsInt()
    @IsOptional()
    id?: number;
  
    @IsInt()
    @IsOptional()
    horaExtraId?: number;
  
    @IsEnum(['PENDIENTE', 'APROBADO', 'RECHAZADO'])
    @IsOptional()
    estado?: string;
  
    @IsString()
    @IsOptional()
    comentario?: string;
  
    @IsOptional()
    fechaAprobacion?: Date;
  
    @IsOptional()
    fechaCreacion?: Date;
}
