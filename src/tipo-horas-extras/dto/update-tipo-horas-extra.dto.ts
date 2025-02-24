import { PartialType } from '@nestjs/mapped-types';
import { CreateTipoHorasExtraDto } from './create-tipo-horas-extra.dto';

export class UpdateTipoHorasExtraDto extends PartialType(CreateTipoHorasExtraDto) {}
