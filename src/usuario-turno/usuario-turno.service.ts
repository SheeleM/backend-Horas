import { Injectable } from '@nestjs/common';
import { CreateUsuarioTurnoDto } from './dto/create-usuario-turno.dto';
import { UpdateUsuarioTurnoDto } from './dto/update-usuario-turno.dto';

@Injectable()
export class UsuarioTurnoService {
  create(createUsuarioTurnoDto: CreateUsuarioTurnoDto) {
    return 'This action adds a new usuarioTurno';
  }

  findAll() {
    return `This action returns all usuarioTurno`;
  }

  findOne(id: number) {
    return `This action returns a #${id} usuarioTurno`;
  }

  update(id: number, updateUsuarioTurnoDto: UpdateUsuarioTurnoDto) {
    return `This action updates a #${id} usuarioTurno`;
  }

  remove(id: number) {
    return `This action removes a #${id} usuarioTurno`;
  }
}
