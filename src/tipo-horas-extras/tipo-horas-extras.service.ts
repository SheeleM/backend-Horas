import { Injectable } from '@nestjs/common';
import { CreateTipoHorasExtraDto } from './dto/create-tipo-horas-extra.dto';
import { UpdateTipoHorasExtraDto } from './dto/update-tipo-horas-extra.dto';

@Injectable()
export class TipoHorasExtrasService {
  create(createTipoHorasExtraDto: CreateTipoHorasExtraDto) {
    return 'This action adds a new tipoHorasExtra';
  }

  findAll() {
    return `This action returns all tipoHorasExtras`;
  }

  findOne(id: number) {
    return `This action returns a #${id} tipoHorasExtra`;
  }

  update(id: number, updateTipoHorasExtraDto: UpdateTipoHorasExtraDto) {
    return `This action updates a #${id} tipoHorasExtra`;
  }

  remove(id: number) {
    return `This action removes a #${id} tipoHorasExtra`;
  }
}
