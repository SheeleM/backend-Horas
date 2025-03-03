import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateLoginDto } from './dto/create-login.dto';
import { UpdateLoginDto } from './dto/update-login.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class LoginService {

  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService
  ){}

  async login(createLoginDto: CreateLoginDto) {
    const { cedula, password } = createLoginDto;
    const cedulaNum = Number(cedula);

    const user = await this.userRepository.findOne({
      where: { cedula: cedulaNum, estado: true }, // Añadido estado: true para verificar usuarios activos
      relations: ['rol']
    });

    if (!user) {
      throw new UnauthorizedException('Credenciales incorrectas');
    }

    // Verificar contraseña
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciales inválidas');
    }
    
    // Generar token JWT
    const payload = { 
      sub: user.id, 
      username: user.cedula,
      roles: [user.rol.nombre]
    };

    return {
      user: {
        id: user.id,
        cedula: user.cedula,
        nombre: user.fullname,
        rol: user.rol.nombre
      },
      access_token: this.jwtService.sign(payload),
    };
  }

  // Eliminar métodos CRUD que no son necesarios para el login o moverlos a otro servicio si se necesitan

}