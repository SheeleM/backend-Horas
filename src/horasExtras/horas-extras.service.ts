import { Injectable } from '@nestjs/common';
import { CreateHorasExtraDto } from './dto/create-horas-extra.dto';
import { UpdateHorasExtraDto } from './dto/update-horas-extra.dto';

@Injectable()
export class HorasExtrasService {
  create(createHorasExtraDto: CreateHorasExtraDto) {
    return 'This action adds a new horasExtra';
  }

  findAll() {
    return `This action returns all horasExtras`;
  }

  findOne(id: number) {
    return `This action returns a #${id} horasExtra`;
  }

  update(id: number, updateHorasExtraDto: UpdateHorasExtraDto) {
    return `This action updates a #${id} horasExtra`;
  }

  remove(id: number) {
    return `This action removes a #${id} horasExtra`;
  }
}
