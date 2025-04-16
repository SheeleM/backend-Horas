import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  BadRequestException,
  Query,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { RecoverPasswordDto } from './dto/update-password.dto';
import { updatePasswordAdminDto } from './dto/update-password-admin';
// import { SecurityQuestionRequestDto } from './dto/security-question-request.dto';
// import { SecurityQuestionResponseDto } from './dto/security-question-response.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    const userId = Number(id);
    if (isNaN(userId)) {
      throw new BadRequestException('ID inválido');
    }
    return this.userService.findOne(userId);
  }

  @Put()
  update(@Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    const userId = Number(id);
    if (isNaN(userId)) {
      throw new BadRequestException('ID inválido');
    }
    return this.userService.remove(userId);
  }

  @Post('recover')
  async recoverPassword(@Body() dto: RecoverPasswordDto) {
    const { cedula, respuestaSeguridad, newPassword } = dto;
    return this.userService.recoverPassword(cedula, respuestaSeguridad, newPassword);
  }

  @Post('update-password-admin')
  async updatePasswordAdmin(@Body() dto: updatePasswordAdminDto) {
    const { cedula, newPassword } = dto;

    if (!cedula) {
      throw new BadRequestException('La cédula es requerida');
    }

    const cedulaNum = Number(cedula);
    if (isNaN(cedulaNum)) {
      throw new BadRequestException('La cédula debe ser un número válido');
    }

    return this.userService.updatePasswordAdmin(cedulaNum, newPassword);
  }

  @Get('security-question/cedula=:cedula')
  async findByCedular(@Param('cedula') cedula: string) {
      if (!cedula) {
      throw new BadRequestException('La cédula es requerida');
    }

    const parsedCedula = Number(cedula);
    if (isNaN(parsedCedula)) {
      throw new BadRequestException('La cédula debe ser un número válido');
    }

    try {
      return await this.userService.getSecurityQuestion(parsedCedula);
    } catch (error) {
      console.error('Error al obtener la pregunta de seguridad:', error);
      throw new BadRequestException('Error interno del servidor');
    }
  }

  @Post('fullname')
  findOnlyNames(): Promise<any[]> {
    console.log("NUEVOOOO METODO USUARIOS");
    return this.userService.findOnlyNames();
  }
}
