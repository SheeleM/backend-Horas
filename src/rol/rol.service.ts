import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateRolDto } from './dto/create-rol.dto';
import { UpdateRolDto } from './dto/update-rol.dto';
import { Rol } from './entities/rol.entity';
import { GetRolDto } from './dto/get-rol.dto';

@Injectable()
export class RolService {
  constructor(
    @InjectRepository(Rol)
    private rolRepository: Repository<Rol>,
  ) {}

  async create(createRolDto: CreateRolDto): Promise<Rol> {
    const newRol = this.rolRepository.create({
      nombre: createRolDto.nombre,
      descripcion: createRolDto.descripcion || '',
      creacion: new Date().toISOString(),
      actualizado: new Date().toISOString(),
    });
    
    return this.rolRepository.save(newRol);
  }

  async findAll(): Promise<GetRolDto[]> {
    const roles = await this.rolRepository.find();
    return roles.map(rol => ({
      idRol: rol.idRol,
      nombre: rol.nombre
    }));
  }

  async findOne(id: number): Promise<Rol> {
    const rol = await this.rolRepository.findOneBy({ idRol: id });
    
    if (!rol) {
      throw new NotFoundException(`Rol with ID ${id} not found`);
    }
    
    return rol;
  }

  async update(id: number, updateRolDto: UpdateRolDto): Promise<Rol> {
    const rol = await this.findOne(id);
    
    // Update fields if they exist in the DTO
    if (updateRolDto.nombre !== undefined) {
      rol.nombre = updateRolDto.nombre;
    }
    
    if (updateRolDto.descripcion !== undefined) {
      rol.descripcion = updateRolDto.descripcion;
    }
    
    rol.actualizado = new Date().toISOString();
    
    return this.rolRepository.save(rol);
  }

  async remove(id: number): Promise<void> {
    const result = await this.rolRepository.delete(id);
    
    if (result.affected === 0) {
      throw new NotFoundException(`Rol with ID ${id} not found`);
    }
  }
}