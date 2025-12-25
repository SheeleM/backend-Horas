import { Usuario } from './../usuarios/entities/usuario.entity';
import { User } from 'src/user/entities/user.entity';
import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseGuards, Session, HttpCode, HttpStatus, Request, ForbiddenException, Query, BadRequestException } from '@nestjs/common';
import { EstadoHoraExtra, HorasExtra } from './entities/horas-extra.entity';
import { CreateHorasExtraDto } from './dto/create-horas-extra.dto';
import { UpdateHorasExtraDto } from './dto/update-horas-extra.dto';
import { HorasExtraService } from './horas-extras.service';
import { AuthGuard } from '@nestjs/passport';
import { UpdateEstadoDto } from './dto/update-estado.dto';
import { FiltrosHorasExtraDto } from './dto/FiltrosHorasExtraDto';

// Actualizar la interfaz para manejar el array de roles
interface RequestWithUser extends Request {
  user: {
    userId: number;
    username: string;
    roles: string[];  // Cambiado de rol a roles (array)
  };
}

@Controller('horas-extras')
@UseGuards(AuthGuard('jwt'))
export class HorasExtrasController {
  constructor(private readonly horasExtrasService: HorasExtraService) {}

  @Post()
  create(@Req() req: RequestWithUser, @Body() createHorasExtraDto: CreateHorasExtraDto) {

    const userId = req.user.userId;
    if (!userId) {
      throw new Error('No se encontró el ID de usuario en req.user');
    }
    return this.horasExtrasService.create(createHorasExtraDto, userId);
  }
/*
  @Get()
  async findAll(@Req() req: RequestWithUser) {
    const userId = req.user.userId;
    console.log('>>> [HorasExtrasController.findAll] Obteniendo horas extras para usuario:', userId);
    
    if (!userId) {
      throw new Error('No se encontró el ID de usuario en req.user');
    }
    
    // ✅ Solo retornar las horas extras del usuario autenticado
    return await this.horasExtrasService.findByUser(userId);
  }*/


@Get()
@Get()
async findAll(
  @Req() req: RequestWithUser,
  @Query() query: any
) {
  const userId = req.user.userId;
  if (!userId) throw new BadRequestException('Usuario no autenticado');

const rolesUsuario = Array.isArray(req.user.roles) ? req.user.roles : [req.user.roles];
  const { fechaDesde, fechaHasta, estados } = query;

  if (!fechaDesde || !fechaHasta) {
    throw new BadRequestException('fechaDesde y fechaHasta son obligatorios');
  }

  const estadosProcesados = estados
    ? estados.split(',').map((e) => e.trim().toUpperCase() as EstadoHoraExtra)
        .filter((e) => Object.values(EstadoHoraExtra).includes(e))
    : undefined;

  const filtros: FiltrosHorasExtraDto = {
    fechaDesde: new Date(fechaDesde),
    fechaHasta: new Date(fechaHasta),
    estados: estadosProcesados,
  };

  return this.horasExtrasService.findByUserWithFilters(userId, filtros, rolesUsuario);
}


  // ✅ MÉTODO AUXILIAR: Validar formato de fecha
  private validarFormatoFecha(fecha: string): boolean {
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    if (!regex.test(fecha)) return false;
    
    const date = new Date(fecha);
    return date instanceof Date && !isNaN(date.getTime()) && fecha === date.toISOString().split('T')[0];
  }
  /*
  @Get(':id')
  async findOne(@Param('id') id: number, @Req() req: RequestWithUser) {
    const userId = req.user.userId;
    const userRole = req.user.roles[0]?.toLowerCase();
    
    if (!userId) {
      throw new BadRequestException('Usuario no autenticado');
    }
    
    // Verificar permisos basados en el rol
    if (userRole === 'admin') {
      return await this.horasExtrasService.findOne(id);
    }
    
    return await this.horasExtrasService.findOne(id, userId);
  }
*/
  @Patch(':id')
  async updateIndividual(
    @Param('id') id: number,
    @Body() updateHorasExtraDto: UpdateHorasExtraDto,
    @Req() req: RequestWithUser
  ): Promise<HorasExtra> {
    const userId = req.user.userId;
    const userRole = req.user.roles[0]?.toLowerCase();
    
    if (!userId) {
      throw new Error('No se encontró el ID de usuario en req.user');
    }
 console.log("usuario rol problem",userRole)
    // ✅ Validar que el usuario solo pueda editar sus propias horas extras
    const horaExtra = await this.horasExtrasService.findOne(id);
    if (horaExtra.usuarioE !== userId) {
      throw new ForbiddenException('No tienes permisos para editar esta hora extra');
    }
    

    return this.horasExtrasService.updateIndividual(id, updateHorasExtraDto, userId, userRole);
  }

  @Delete(':id')
  async remove(@Param('id') id: number, @Req() req: RequestWithUser): Promise<void> {
    const userId = req.user.userId;
    
    if (!userId) {
      throw new Error('No se encontró el ID de usuario en req.user');
    }

    // ✅ Validar que el usuario solo pueda eliminar sus propias horas extras
    const horaExtra = await this.horasExtrasService.findOne(id);
    if (horaExtra.usuarioE !== userId) {
      throw new ForbiddenException('No tienes permisos para eliminar esta hora extra');
    }

    await this.horasExtrasService.remove(id);
  }

  @Patch(':id/estado')
  async updateEstado(
    @Param('id') id: number,
    @Body() updateEstadoDto: UpdateEstadoDto,
    @Req() req: RequestWithUser
  ) {
    
    
    const userId = req.user.userId;
    if (!userId) {
      throw new BadRequestException('Usuario no autenticado');
    }

    try {
      const resultado = await this.horasExtrasService.updateEstado(
        Number(id), // Asegurarse de que id sea número
        updateEstadoDto.estado,
        userId
      );

      return resultado;
    } catch (error) {
      throw error;
    }
  }
}