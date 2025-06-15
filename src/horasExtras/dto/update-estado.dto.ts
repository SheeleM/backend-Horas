import { IsEnum } from 'class-validator';
import { EstadoHoraExtra } from '../entities/horas-extra.entity';

export class UpdateEstadoDto {
    @IsEnum(EstadoHoraExtra, {
        message: `Estado debe ser uno de los siguientes valores: ${Object.values(EstadoHoraExtra).join(', ')}`
    })
    estado: EstadoHoraExtra;
}
