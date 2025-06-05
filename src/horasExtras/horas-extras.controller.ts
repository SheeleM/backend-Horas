import { Usuario } from './../usuarios/entities/usuario.entity';
import { User } from 'src/user/entities/user.entity';
import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseGuards, Session, HttpCode, HttpStatus } from '@nestjs/common';
import { HorasExtra } from './entities/horas-extra.entity';
import { CreateHorasExtraDto } from './dto/create-horas-extra.dto';
import { UpdateHorasExtraDto } from './dto/update-horas-extra.dto'; // Asegúrate de importar el DTO para actualizar
import { HorasExtraService } from './horas-extras.service';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { UpdateEstadoDto } from './dto/update-estado.dto';

// Define la interfaz para el Request con user
interface RequestWithUser extends Request {
  user: {
    userId: number;
    username: string;
    roles: string[];
  };
}
@Controller('horas-extras')
@UseGuards(AuthGuard('jwt')) // Usa el nombre de la estrategia: 'jwt'
export class HorasExtrasController {
  constructor(private readonly horasExtrasService: HorasExtraService) {}

  @Post()
  create(@Req() req: RequestWithUser, @Body() createHorasExtraDto: CreateHorasExtraDto) {
    console.log("Usuario autenticado:", req.user);
    //const user = req.user as { id: number; username: string; roles: string[] };

    const userId = req.user.userId;
    if (!userId) {
      throw new Error('No se encontró el ID de usuario en req.user');
    }
    return this.horasExtrasService.create(createHorasExtraDto, userId);
  }

  
  @Get()
  findAll() {
    return this.horasExtrasService.findAll();
  }

  @Patch(':id')
  async updateIndividual(
    @Param('id') id: number,
    @Body() updateHorasExtraDto: UpdateHorasExtraDto,
    @Req() request: any
  ): Promise<HorasExtra> {  // Changed from HorasExtra[] to HorasExtra
    // Extraer el ID del usuario del token JWT
    const userId = request.user.id;

    // Llamar al servicio para actualizar
    return this.horasExtrasService.updateIndividual(id, updateHorasExtraDto);
  }

  @Delete(':id')
  //@HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: number): Promise<void> {
    await this.horasExtrasService.remove(id);
  }

  @Patch(':id/estado')
  //@UseGuards(AuthGuard('jwt'))
  async updateEstado(
    @Param('id') id: number,
    @Body() updateEstadoDto: UpdateEstadoDto,
    @Req() request: RequestWithUser
  ) {
    console.log('Estado recibido:', updateEstadoDto.estado);
    return this.horasExtrasService.updateEstado(
      id,
      updateEstadoDto.estado,
      request.user.userId
    );
  }
}
