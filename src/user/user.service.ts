import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { Rol } from 'src/rol/entities/rol.entity';
import { Pregunta } from 'src/preguntas/entities/pregunta.entity';


@Injectable()
export class UserService {

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    
  ) { }

  async create(createUserDto: CreateUserDto) {
    const user = this.userRepository.create({
      ...createUserDto, // Copiar los datos del DTO
      preguntas:{id:createUserDto.preguntas} as Pregunta,
      rol: { idRol: 1 } as Rol,
    });
    return await this.userRepository.save(user);
  }


  async findAll() {
    return await this.userRepository.find();
  }

  async findOne(id: number) {
    return await this.userRepository.findOneBy({ id })
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    return await this.userRepository.update(id, {
      ...updateUserDto, 
      preguntas:{id:updateUserDto.preguntas} as Pregunta,
      rol: { idRol: 1 } as Rol,
    });
  }

  async remove(id: number) {
    return await this.userRepository.softDelete({ id });
  }
}
