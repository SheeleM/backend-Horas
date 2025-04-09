import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AsignacionTurnoService } from './asignacion-turno.service';
import { CreateAsignacionTurnoDto } from './dto/create-asignacion-turno.dto';
import { UpdateAsignacionTurnoDto } from './dto/update-asignacion-turno.dto';

@Controller('asignacion-turno')
export class AsignacionTurnoController {
  constructor(private readonly asignacionTurnoService: AsignacionTurnoService) {}

  @Post()
  create(@Body() createAsignacionTurnoDto: CreateAsignacionTurnoDto) {
    return this.asignacionTurnoService.create(createAsignacionTurnoDto);
  }

  @Get()
  findAll() {
    return this.asignacionTurnoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.asignacionTurnoService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAsignacionTurnoDto: UpdateAsignacionTurnoDto) {
    return this.asignacionTurnoService.update(+id, updateAsignacionTurnoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.asignacionTurnoService.remove(+id);
  }
}
