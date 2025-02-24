import { PartialType } from '@nestjs/mapped-types';
import { CreateDetalleHoraExtraDto } from './create-detalle-hora-extra.dto';

export class UpdateDetalleHoraExtraDto extends PartialType(CreateDetalleHoraExtraDto) {}
