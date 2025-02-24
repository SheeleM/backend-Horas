import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AprobacionesService } from './aprobaciones.service';
import { CreateAprobacioneDto } from './dto/create-aprobacione.dto';
import { UpdateAprobacioneDto } from './dto/update-aprobacione.dto';

@Controller('aprobaciones')
export class AprobacionesController {
  constructor(private readonly aprobacionesService: AprobacionesService) {}

  @Post()
  create(@Body() createAprobacioneDto: CreateAprobacioneDto) {
    return this.aprobacionesService.create(createAprobacioneDto);
  }

  @Get()
  findAll() {
    return this.aprobacionesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.aprobacionesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAprobacioneDto: UpdateAprobacioneDto) {
    return this.aprobacionesService.update(+id, updateAprobacioneDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.aprobacionesService.remove(+id);
  }
}
