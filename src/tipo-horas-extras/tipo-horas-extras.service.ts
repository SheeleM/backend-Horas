import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { CreateTipoHorasExtraDto } from './dto/create-tipo-horas-extra.dto';
import { UpdateTipoHorasExtraDto } from './dto/update-tipo-horas-extra.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { TipoHorasExtra } from './entities/tipo-horas-extra.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TipoHorasExtrasService {

   constructor(
      @InjectRepository(TipoHorasExtra)
      private tipodeHoraRepository: Repository<TipoHorasExtra>,
    ) {
      console.log('>>> Repositorio inyectado correctamente');
    }
  
  async create(createTipoHorasExtraDto: CreateTipoHorasExtraDto) {
    // Mapear el DTO a la entidad
    const tipoHoraExtra = this.tipodeHoraRepository.create({
      ...createTipoHorasExtraDto,
      // Puedes agregar valores por defecto para creado/actualizado si lo deseas
      creado: new Date(),
      actualizado: new Date(),
    });
    // Guardar en la base de datos
    const saved = await this.tipodeHoraRepository.save(tipoHoraExtra);
    return {
      message: 'Tipo de hora extra creado exitosamente',
      data: saved,
    };
  }

  async findAll() {
    // Devuelve todos los registros de tipo de hora extra
    const tipos = await this.tipodeHoraRepository.find();
    return {
      message: 'Lista de tipos de horas extra',
      data: tipos,
    };
  }

  async findOne(id: number) {
    const tipoHoraExtra = await this.tipodeHoraRepository.findOne({ where: { id } });
    if (!tipoHoraExtra) {
      throw new NotFoundException(`Tipo de hora extra con id ${id} no encontrado`);
    }
    return tipoHoraExtra;
  }

  async update(id: number, updateTipoHorasExtraDto: UpdateTipoHorasExtraDto): Promise<TipoHorasExtra> {
    const tipoHora = await this.tipodeHoraRepository.findOne({ where: { id } });
    if (!tipoHora) {
      throw new NotFoundException(`Tipo de hora extra con id ${id} no encontrado`);
    }

    // Controlar si el código ya existe en otro registro
    if (
      updateTipoHorasExtraDto.codigoHoraExtra &&
      updateTipoHorasExtraDto.codigoHoraExtra !== tipoHora.codigoHoraExtra
    ) {
      const existe = await this.tipodeHoraRepository.findOne({
        where: { codigoHoraExtra: updateTipoHorasExtraDto.codigoHoraExtra },
      });
      if (existe && existe.id !== id) {
        throw new BadRequestException(`Ya existe un tipo de hora extra con el código '${updateTipoHorasExtraDto.codigoHoraExtra}'`);
      }
    }

    // Actualiza los campos y la fecha de actualización
    Object.assign(tipoHora, updateTipoHorasExtraDto, { actualizado: new Date() });
    return await this.tipodeHoraRepository.save(tipoHora);
  }

  async remove(id: number) {
    const tipoHora = await this.tipodeHoraRepository.findOne({ where: { id } });
    if (!tipoHora) {
      throw new NotFoundException(`Tipo de hora extra con id ${id} no encontrado`);
    }
    await this.tipodeHoraRepository.remove(tipoHora);
    return {
      message: `Tipo de hora extra con id ${id} eliminado exitosamente`,
    };
  }
}
