import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUsuarioTurnoDto } from './dto/create-usuario-turno.dto';
import { UpdateUsuarioTurnoDto } from './dto/update-usuario-turno.dto';
import { UsuarioTurno } from './entities/usuario-turno.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GetUserDto } from 'src/user/dto/get-user.dto';
import { GetUsuarioTurnoDto } from './dto/get-usuario-Turno.dto';
import { Turno } from 'src/turno/entities/turno.entity';
import { User } from 'src/user/entities/user.entity';

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
    //  usuarioTurno.mes = createUsuarioTurnoDto.mes;
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
    

async findOne(id: number): Promise<GetUsuarioTurnoDto> {
  const usuarioTurno = await this.usuarioTurnoRepository.findOne({
    where: { idUsuarioTurno: id },
    relations: ['userTurno', 'turno']
  });
  
  if (!usuarioTurno) {
    throw new NotFoundException(`UsuarioTurno con ID ${id} no encontrado`);
  }
  
  return new GetUsuarioTurnoDto(usuarioTurno);
}
async update(id: number, updateUsuarioTurnoDto: UpdateUsuarioTurnoDto): Promise<UsuarioTurno> {
  // Verificar que el registro existe
  const usuarioTurno = await this.usuarioTurnoRepository.findOne({ 
    where: { idUsuarioTurno: id }
  });
  
  if (!usuarioTurno) {
    throw new NotFoundException(`UsuarioTurno con ID ${id} no encontrado`);
  }

  try {
    // Usa un objeto simple para la actualización - evita relaciones
    const updateData: any = {
      actualizado: new Date()
    };
    
    // Solo añade los campos que vienen en el DTO
    //if (updateUsuarioTurnoDto.mes !== undefined) updateData.mes = updateUsuarioTurnoDto.mes;
    if (updateUsuarioTurnoDto.turnoFK !== undefined) updateData.turnoFK = updateUsuarioTurnoDto.turnoFK;
    if (updateUsuarioTurnoDto.usuarioFK !== undefined) updateData.usuarioFK = updateUsuarioTurnoDto.usuarioFK;
    
    if (updateUsuarioTurnoDto.fechaInicio !== undefined) {
      updateData.fechaInicio = new Date(updateUsuarioTurnoDto.fechaInicio);
    }
    
    if (updateUsuarioTurnoDto.fechaFin !== undefined) {
      updateData.fechaFin = new Date(updateUsuarioTurnoDto.fechaFin);
    }
    
    // Usar el método .update() del repositorio que es más directo
    await this.usuarioTurnoRepository.update(id, updateData);
    
    // Recuperar el objeto actualizado
    const updated = await this.usuarioTurnoRepository.findOne({
      where: { idUsuarioTurno: id }
    });
    
    return updated!;
  } catch (error) {
    console.error('Error al actualizar:', error);
    throw new Error(`Error al actualizar el usuario turno: ${error.message}`);
  }
}
  /*
  remove(id: number) {
    return `This action removes a #${id} usuarioTurno`;
  }
*/
    async remove(id: number): Promise<void> {
      const result = await this.usuarioTurnoRepository.delete(id);
  
      if (result.affected === 0) {
        throw new NotFoundException(`Turno with ID ${id} not found`);
      }
    }
  
}
