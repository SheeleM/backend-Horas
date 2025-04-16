import { ConflictException, Injectable, Logger } from '@nestjs/common';
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

  async recoverPassword(
    cedula: number,
    respuestaSeguridad: string,
    newPassword: string,
  ) {
    try {
      const user = await this.userRepository.findOne({
        where: { cedula },
        relations: ['preguntas'],
      });

      if (!user) {
        return { success: false, message: 'Usuario no encontrado' };
      }

      const userRespuesta = String(user.respuestaSeguridad)
        .trim()
        .toLowerCase();
      const inputRespuesta = String(respuestaSeguridad).trim().toLowerCase();

      if (userRespuesta !== inputRespuesta) {
        console.log('Las respuestas NO coinciden - debería fallar');
        return { success: false, message: 'Respuesta de seguridad incorrecta' };
      }

      user.password = newPassword;
      await this.userRepository.save(user);
      return {
        success: true,
        message: 'Contraseña actualizada exitosamente',
        user: new GetUserDto(user),
      };
    } catch (error) {
      console.error('Error recuperando contraseña:', error);
      throw error;
    }
  }

  async updatePasswordAdmin(cedula: number, newPassword: string) {
    try {
      // Validar que cedula es un número válido
      if (!cedula || isNaN(cedula)) {
        return {
          success: false,
          message: 'Cédula inválida',
        };
      }

      const user = await this.userRepository.findOne({ where: { cedula } });

      if (!user) {
        return { affected: 0, message: 'User not found' };
      }

      user.password = newPassword;
      await this.userRepository.save(user);
    } catch (error) {
      console.error('Error updating user password:', error);
      throw error;
    }
  }
  
  async getSecurityQuestion(cedula: number) {


    try {


      const user = await this.userRepository
        .createQueryBuilder('user')
        .leftJoinAndSelect('user.preguntas', 'pregunta')
        .where('user.cedula = :cedula', { cedula })
        .andWhere('user.deleteAt IS NULL')
        .getOne();

      if (!user) {
        return {
          success: false,
          message: 'Usuario no encontrado',
        };
      }

      if (!user.preguntas) {
        return {
          success: false,
          message: 'No se encontró pregunta de seguridad para este usuario',
        };
      }

      return {
        success: true,
        question: user.preguntas.pregunta,
        userId: user.id,
      };
    } catch (error) {
      console.error('Error obteniendo pregunta de seguridad:', error);
      return {
        success: false,
        message: 'Error interno al obtener la pregunta de seguridad',
      };
    }
  }


  // turno.service.ts
async findOnlyNames(): Promise<any[]> {
  const usuarios = await this.userRepository.find({
    select: ['fullname', 'id'], // solo selecciona la columna 'nombre'
  });

  return usuarios;
}
}
