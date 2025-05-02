import { Usuario } from './../usuarios/entities/usuario.entity';
import { User } from 'src/user/entities/user.entity';
import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseGuards, Session } from '@nestjs/common';
import { CreateHorasExtraDto } from './dto/create-horas-extra.dto';
import { HorasExtraService } from './horas-extras.service';
import { AuthGuard } from '@nestjs/passport';
import { JwtAuthGuard } from 'src/login/JwtAuthGuard';
import { Request } from 'express';
import * as session from 'express-session'

// Define la interfaz para el Request con user
interface RequestWithUser extends Request {
  user: {
    id: number;
    username: string;
    roles: string[];
  };
}
@Controller('horas-extras')
@UseGuards(AuthGuard('jwt')) // Usa el nombre de la estrategia: 'jwt'
export class HorasExtrasController {
  constructor(private readonly horasExtrasService: HorasExtraService) {}

  @Post()
  create(@Req() req: RequestWithUser, @Body() createHorasExtraDto: CreateHorasExtraDto, @Session() session: Record<string, any>) {

    return this.horasExtrasService.create(createHorasExtraDto, session.userId);
  }

}
