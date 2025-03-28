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
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { RecoverPasswordDto } from './dto/update-password.dto';
import { updatePasswordAdminDto } from './dto/update-password-admin';
import { SecurityQuestionRequestDto } from './dto/SecurityQuestionRequestDto.dto';
import { SecurityQuestionResponseDto } from './dto/SecurityQuestionResponseDto.dto';

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
    return this.userService.findOne(+id);
  }

  @Put()
  update(@Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }

  @Post('/recover')
  async recoverPassword(@Body() recoverPasswordDto: RecoverPasswordDto) {
    const { cedula, respuestaSeguridad, newPassword } = recoverPasswordDto;
    return await this.userService.recoverPassword(
      cedula,
      respuestaSeguridad,
      newPassword,
    );
  }

  @Post('/update-password-admin')
  async updatePasswordAdmin(
    @Body() updatePasswordAdminDto: updatePasswordAdminDto, // Tipo corregido
  ) {
    const { cedula, newPassword } = updatePasswordAdminDto; // Propiedad corregida

    // Verificar que cédula no es undefined
    if (cedula === undefined) {
      throw new BadRequestException('La cédula es requerida');
    }

    // Convertir explícitamente a número si es necesario
    const cedulaNum = Number(cedula);

    // Verificar que sea un número válido
    if (isNaN(cedulaNum)) {
      throw new BadRequestException('La cédula debe ser un número válido');
    }

    return await this.userService.updatePasswordAdmin(cedulaNum, newPassword);
  }

  /*
  @Get('/security-question')
  @UsePipes(new ValidationPipe({ transform: true }))
  async getSecurityQuestion(
    @Query() request: SecurityQuestionRequestDto,
  ): Promise<SecurityQuestionResponseDto> {
    return this.userService.getSecurityQuestion(request.cedula);
  }
*/

  @Get('/security-question')
  async getSecurityQuestion(@Query('cedula') cedula: string) {
    try {
      // Validación de entrada
      if (!cedula) {
        return {
          success: false,
          message: 'Cédula es requerida',
        };
      }

      // Convertir a número
      const parsedCedula = parseInt(cedula, 10);

      // Validar que sea un número válido
      if (isNaN(parsedCedula)) {
        return {
          success: false,
          message: 'Cédula inválida',
        };
      }

      // Llamar al servicio para obtener la pregunta de seguridad
      return await this.userService.getSecurityQuestion(parsedCedula);
    } catch (error) {
      console.error(
        'Error en el controlador al obtener pregunta de seguridad:',
        error,
      );
      return {
        success: false,
        message: 'Error interno del servidor',
      };
    }
  }
}
