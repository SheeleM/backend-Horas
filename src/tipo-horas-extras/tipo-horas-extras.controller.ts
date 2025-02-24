import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TipoHorasExtrasService } from './tipo-horas-extras.service';
import { CreateTipoHorasExtraDto } from './dto/create-tipo-horas-extra.dto';
import { UpdateTipoHorasExtraDto } from './dto/update-tipo-horas-extra.dto';

@Controller('tipo-horas-extras')
export class TipoHorasExtrasController {
  constructor(private readonly tipoHorasExtrasService: TipoHorasExtrasService) {}

  @Post()
  create(@Body() createTipoHorasExtraDto: CreateTipoHorasExtraDto) {
    return this.tipoHorasExtrasService.create(createTipoHorasExtraDto);
  }

  @Get()
  findAll() {
    return this.tipoHorasExtrasService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tipoHorasExtrasService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTipoHorasExtraDto: UpdateTipoHorasExtraDto) {
    return this.tipoHorasExtrasService.update(+id, updateTipoHorasExtraDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tipoHorasExtrasService.remove(+id);
  }
}
