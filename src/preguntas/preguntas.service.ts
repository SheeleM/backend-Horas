import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Pregunta } from './entities/pregunta.entity';
import { CreatePreguntaDto } from './dto/create-pregunta.dto';
import { UpdatePreguntaDto } from './dto/update-pregunta.dto';
import { GetPreguntaDto } from './dto/get-pregunta.dto';

@Injectable()
export class PreguntasService {
  constructor(
    @InjectRepository(Pregunta)
    private readonly preguntaRepository: Repository<Pregunta>,
  ) {}

  // Crear una nueva pregunta
  async create(createPreguntaDto: CreatePreguntaDto): Promise<Pregunta> {
    const nuevaPregunta = this.preguntaRepository.create(createPreguntaDto);
    return await this.preguntaRepository.save(nuevaPregunta);
  }

  // Obtener todas las preguntas
  async findAll(): Promise<GetPreguntaDto[]> {
    const preguntas = await this.preguntaRepository.find();
    return preguntas.map(p => ({ id: p.id, pregunta: p.pregunta }));
  }

  // Obtener una pregunta por ID
  async findOne(id: number): Promise<GetPreguntaDto> {
    const pregunta = await this.preguntaRepository.findOne({ where: { id } });
    if (!pregunta) {
      throw new NotFoundException(`No se encontró la pregunta con ID ${id}`);
    }
    return { id: pregunta.id, pregunta: pregunta.pregunta };
  }
  
 

  // Actualizar una pregunta
  async update(id: number, updatePreguntaDto: UpdatePreguntaDto): Promise<Pregunta> {
    const pregunta = await this.findOne(id);
    Object.assign(pregunta, updatePreguntaDto);
    return await this.preguntaRepository.save(pregunta);
  }

  // Eliminar una pregunta
  async remove(id: number): Promise<void> {
    const pregunta = await this.preguntaRepository.findOne({ where: { id } });
    if (!pregunta) {
      throw new Error(`Pregunta con ID ${id} no encontrada`);
    }
    await this.preguntaRepository.remove(pregunta);
  }

}
