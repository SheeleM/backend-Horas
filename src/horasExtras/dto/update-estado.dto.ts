import { IsEnum } from 'class-validator';
import { EstadoHoraExtra } from '../entities/horas-extra.entity';

export class UpdateEstadoDto {
    @IsEnum(EstadoHoraExtra, {
        message: 'El estado debe ser: PENDIENTE, APROBADA, RECHAZADA o EN_REVISION'
    })
    estado: EstadoHoraExtra;
}
