import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTurnoDto } from './dto/create-turno.dto';
import { UpdateTurnoDto } from './dto/update-turno.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Turno } from './entities/turno.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TurnoService {
  constructor(
    @InjectRepository(Turno)
    private turnoRepository: Repository<Turno>,
  ) {}

  async create(createTurnoDto: CreateTurnoDto): Promise<Turno> {
    const turno = new Turno();
    turno.codigo = createTurnoDto.codigo;
    turno.nombre = createTurnoDto.nombre;
    turno.horaInicio = new Date(createTurnoDto.horaInicio);
    turno.horaFin = new Date(createTurnoDto.horaFin);
    turno.diaInicio = createTurnoDto.diaInicio;
    turno.diaFin = createTurnoDto.diaFin;
    turno.cread = new Date();
    turno.actualizado = new Date();

    return this.turnoRepository.save(turno);
  }

  async findAll(): Promise<Turno[]> {
    return this.turnoRepository.find({
      relations: ['usuarioTurno'],
    });
  }

  async findOne(id: number): Promise<Turno> {
    const turno = await this.turnoRepository.findOne({
      where: { idTurno: id },
      relations: ['usuarioTurno'],
    });

    if (!turno) {
      throw new NotFoundException(`Turno with ID ${id} not found`);
    }

    return turno;
  }

  async update(id: number, updateTurnoDto: UpdateTurnoDto): Promise<Turno> {
    const turno = await this.findOne(id);

    // Update only the provided fields
    if (updateTurnoDto.codigo !== undefined) {
      turno.codigo = updateTurnoDto.codigo;
    }
    if (updateTurnoDto.nombre !== undefined) {
      turno.nombre = updateTurnoDto.nombre;
    }
    if (updateTurnoDto.horaInicio !== undefined) {
      turno.horaInicio = new Date(updateTurnoDto.horaInicio);
    }
    if (updateTurnoDto.horaFin !== undefined) {
      turno.horaFin = new Date(updateTurnoDto.horaFin);
    }
    if (updateTurnoDto.diaInicio !== undefined) {
      turno.diaInicio = updateTurnoDto.diaInicio;
    }
    if (updateTurnoDto.diaFin !== undefined) {
      turno.diaFin = updateTurnoDto.diaFin;
    }

    turno.actualizado = new Date();

    return this.turnoRepository.save(turno);
  }

  async remove(id: number): Promise<void> {
    const result = await this.turnoRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`Turno with ID ${id} not found`);
    }
  }

  async findByCode(codigo: string): Promise<Turno[]> {
    return this.turnoRepository.find({
      where: { codigo },
      relations: ['usuarioTurno'],
    });
  }
}
