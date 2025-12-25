import { Injectable, UnauthorizedException, Session } from '@nestjs/common';
import { CreateLoginDto } from './dto/create-login.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class LoginService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async login(createLoginDto: CreateLoginDto,  session: Record<string, any>) {
    const { cedula, password } = createLoginDto;
    const cedulaNum = Number(cedula);

    const user = await this.userRepository.findOne({
      where: { cedula: cedulaNum, estado: true },
      relations: ['rol'],
    });



    if (!user) {

      throw new UnauthorizedException('Credenciales incorrectas');
    }

    // Verificar contraseña
    // const isPasswordValid = await bcrypt.compare(password, user.password);
    const isPasswordValid = password === user.password; //almacenado en texto plano

    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciales inválidas2daFFFF');
    }

    // Generar token JWT
    const payload = {
      sub: user.id,
      username: user.cedula,
      roles: [user.rol.nombre],
    };
    session.userId = user.id; // Guardar el ID del usuario en la sesión
    return {
      user: {
        id: user.id,
        cedula: user.cedula,
        nombre: user.fullname,
        rol: user.rol.nombre,
      },
      access_token: this.jwtService.sign(payload),
    };
  }
}
