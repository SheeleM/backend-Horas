import { Controller, Post, Body, Get } from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { Usuario } from './entities/usuario.entity';

@Controller('usuarios')
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  @Post()
  create(@Body() createUsuarioDto: CreateUsuarioDto): Usuario {
    return this.usuariosService.create(createUsuarioDto);
  }

  @Get()
  findAll(): Usuario[] {
    return this.usuariosService.findAll();
  }
}
