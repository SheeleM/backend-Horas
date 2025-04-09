import { Injectable } from '@nestjs/common';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { Usuario } from './entities/usuario.entity';


@Injectable()
export class UsuariosService {
  private usuarios: Usuario[] = [];
  private idCounter = 1;

  create(dto: CreateUsuarioDto): Usuario {
    if (dto.password !== dto.confirmPassword) {
      throw new Error('Las contraseñas no coinciden.');
    }

    const nuevoUsuario: Usuario = {
      id: this.idCounter++,
      fullname: dto.fullname,
      cedula: dto.cedula,
      password: dto.password,
      preguntas: dto.preguntas,
      respuestaSeguridad: dto.respuestaSeguridad,
    };

    this.usuarios.push(nuevoUsuario);
    return nuevoUsuario;
  }

  findAll(): Usuario[] {
    return this.usuarios;
  }
}
