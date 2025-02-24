import { PartialType } from '@nestjs/mapped-types';
import { CreateHorasExtraDto } from './create-horas-extra.dto';

export class UpdateHorasExtraDto extends PartialType(CreateHorasExtraDto) {}
