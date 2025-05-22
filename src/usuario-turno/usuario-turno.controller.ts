import { Controller, Get, Post, Body, Patch, Param, Delete, HttpException, HttpStatus } from '@nestjs/common';
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
  
  @Post('delete-multiple')
  async removeMultiple(@Body() body: { ids: number[] }) {
    return this.usuarioTurnoService.removeMultiple(body.ids);
  }

  @Post('verificar-superposicion')
  async verificarSuperposicion(
    @Body() body: { usuarioFK: number; fechaInicio: Date; fechaFin: Date; idExcluir?: string | number }
  ) {
    try {
      // Convertir idExcluir a número si existe
      const idExcluir = body.idExcluir ? parseInt(body.idExcluir.toString()) : undefined;
      
      // Validar que sea un número válido si existe
      if (idExcluir !== undefined && isNaN(idExcluir)) {
        throw new HttpException(
          {
            message: 'El ID a excluir debe ser un número válido',
            error: 'Bad Request'
          },
          HttpStatus.BAD_REQUEST
        );
      }

      const resultado = await this.usuarioTurnoService.verificarSuperposicion(
        body.usuarioFK,
        body.fechaInicio,
        body.fechaFin,
        idExcluir
      );
      return resultado;
    } catch (error) {
      throw new HttpException(
        {
          message: error.message || 'Error al verificar superposición',
          error: 'Bad Request'
        },
        HttpStatus.BAD_REQUEST
      );
    }
  }
}
