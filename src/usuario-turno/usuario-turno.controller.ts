import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UsuarioTurnoService } from './usuario-turno.service';
import { CreateUsuarioTurnoDto } from './dto/create-usuario-turno.dto';
import { UpdateUsuarioTurnoDto } from './dto/update-usuario-turno.dto';

@Controller('usuario-turno')
export class UsuarioTurnoController {
  constructor(private readonly usuarioTurnoService: UsuarioTurnoService) {}

  @Post()
  create(@Body() createUsuarioTurnoDto: CreateUsuarioTurnoDto) {
    return this.usuarioTurnoService.create(createUsuarioTurnoDto);
  }

  @Get()
  findAll() {
    return this.usuarioTurnoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usuarioTurnoService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUsuarioTurnoDto: UpdateUsuarioTurnoDto) {
    return this.usuarioTurnoService.update(+id, updateUsuarioTurnoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usuarioTurnoService.remove(+id);
  }
}
