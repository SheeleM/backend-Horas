import { Injectable } from '@nestjs/common';
import { CreateUsuarioTurnoDto } from './dto/create-usuario-turno.dto';
import { UpdateUsuarioTurnoDto } from './dto/update-usuario-turno.dto';
import { UsuarioTurno } from './entities/usuario-turno.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GetUserDto } from 'src/user/dto/get-user.dto';
import { GetUsuarioTurnoDto } from './dto/get-usuario-Turno.dto';

@Injectable()
export class UsuarioTurnoService {
 constructor(
    @InjectRepository(UsuarioTurno)
    private usuarioTurnoRepository: Repository<UsuarioTurno>,
  ) {
    console.log('>>> Repositorio inyectado correctamente');

  }

    async create(createUsuarioTurnoDto: CreateUsuarioTurnoDto): Promise<UsuarioTurno> {
      const usuarioTurno = new UsuarioTurno();
      usuarioTurno.mes = createUsuarioTurnoDto.mes;
      usuarioTurno.turnoFK=createUsuarioTurnoDto.turnoFK;
      usuarioTurno.usuarioFK=createUsuarioTurnoDto.usuarioFK;
      usuarioTurno.fechaInicio=createUsuarioTurnoDto.fechaInicio;
      usuarioTurno.fechaFin=createUsuarioTurnoDto.fechaFin;
      usuarioTurno.creado = new Date();
      usuarioTurno.actualizado = new Date();
     return this.usuarioTurnoRepository.save(usuarioTurno);
    }
/*
  findAll() {
    return `This action returns all usuarioTurno`;
  }*/

/*
    async findAll(): Promise<GetUsuarioTurnoDto[]> {
      const usersTurno = await this.usuarioTurnoRepository.find();
      return usersTurno.map(userTurno => new GetUsuarioTurnoDto(userTurno));
    }*/

      // In usuario-turno.service.ts

      async findAll() {
  const usuarioTurnos = await this.usuarioTurnoRepository.find({
    relations: ['userTurno', 'turno']
  });
  
  return usuarioTurnos.map(usuarioTurno => new GetUsuarioTurnoDto(usuarioTurno));
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
