import { Injectable } from '@nestjs/common';
import { CreateDetalleHoraExtraDto } from './dto/create-detalle-hora-extra.dto';
import { UpdateDetalleHoraExtraDto } from './dto/update-detalle-hora-extra.dto';

@Injectable()
export class DetalleHoraExtrasService {
  create(createDetalleHoraExtraDto: CreateDetalleHoraExtraDto) {
    return 'This action adds a new detalleHoraExtra';
  }

  findAll() {
    return `This action returns all detalleHoraExtras`;
  }

  findOne(id: number) {
    return `This action returns a #${id} detalleHoraExtra`;
  }

  update(id: number, updateDetalleHoraExtraDto: UpdateDetalleHoraExtraDto) {
    return `This action updates a #${id} detalleHoraExtra`;
  }

  remove(id: number) {
    return `This action removes a #${id} detalleHoraExtra`;
  }
}
