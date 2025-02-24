import { Injectable } from '@nestjs/common';
import { CreateAprobacioneDto } from './dto/create-aprobacione.dto';
import { UpdateAprobacioneDto } from './dto/update-aprobacione.dto';

@Injectable()
export class AprobacionesService {
  create(createAprobacioneDto: CreateAprobacioneDto) {
    return 'This action adds a new aprobacione';
  }

  findAll() {
    return `This action returns all aprobaciones`;
  }

  findOne(id: number) {
    return `This action returns a #${id} aprobacione`;
  }

  update(id: number, updateAprobacioneDto: UpdateAprobacioneDto) {
    return `This action updates a #${id} aprobacione`;
  }

  remove(id: number) {
    return `This action removes a #${id} aprobacione`;
  }
}
