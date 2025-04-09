import { Injectable } from '@nestjs/common';
import { CreateAsignacionTurnoDto } from './dto/create-asignacion-turno.dto';
import { UpdateAsignacionTurnoDto } from './dto/update-asignacion-turno.dto';

@Injectable()
export class AsignacionTurnoService {
  create(createAsignacionTurnoDto: CreateAsignacionTurnoDto) {
    return 'This action adds a new asignacionTurno';
  }

  findAll() {
    return `This action returns all asignacionTurno`;
  }

  findOne(id: number) {
    return `This action returns a #${id} asignacionTurno`;
  }

  update(id: number, updateAsignacionTurnoDto: UpdateAsignacionTurnoDto) {
    return `This action updates a #${id} asignacionTurno`;
  }

  remove(id: number) {
    return `This action removes a #${id} asignacionTurno`;
  }
}
