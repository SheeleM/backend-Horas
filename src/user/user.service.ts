import { ConflictException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { Rol } from 'src/rol/entities/rol.entity';
import { Pregunta } from 'src/preguntas/entities/pregunta.entity';
import { GetUserDto } from './dto/get-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    // Verificar si la cédula ya existe en la base de datos
    const existingUser = await this.userRepository.findOne({
      where: { cedula: createUserDto.cedula },
    });

    if (existingUser) {
      console.error('El usuario ya existe');
      throw new ConflictException('Comunicate con el administrador');
    }

    // Crear el usuario solo si la cédula no existe
    const user = this.userRepository.create({
      ...createUserDto,
      preguntas: { id: createUserDto.preguntas } as Pregunta,
      rol: { idRol: 1 } as Rol,
    });

    return await this.userRepository.save(user);
  }

  async findAll(): Promise<GetUserDto[]> {
    const users = await this.userRepository.find({
      relations: ['rol'],
    });
    return users.map((user) => new GetUserDto(user));
  }

  async findOne(id: number) {
    return await this.userRepository.findOneBy({ id });
  }

  async update(updateUserDto: UpdateUserDto) {
    try {
      const { id, estado, rol } = updateUserDto;

      const user = await this.userRepository.findOne({ where: { id } });

      if (!user) {
        return { affected: 0, message: 'User not found' };
      }

      if (estado !== undefined) {
        user.estado = estado;
      }

      if (rol !== undefined) {
        user.rol = { idRol: rol } as Rol;
      }
      await this.userRepository.save(user);
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  }
  async remove(id: number) {
    return await this.userRepository.softDelete({ id });
  }
}
