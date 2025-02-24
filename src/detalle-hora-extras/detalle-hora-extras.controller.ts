import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { DetalleHoraExtrasService } from './detalle-hora-extras.service';
import { CreateDetalleHoraExtraDto } from './dto/create-detalle-hora-extra.dto';
import { UpdateDetalleHoraExtraDto } from './dto/update-detalle-hora-extra.dto';

@Controller('detalle-hora-extras')
export class DetalleHoraExtrasController {
  constructor(private readonly detalleHoraExtrasService: DetalleHoraExtrasService) {}

  @Post()
  create(@Body() createDetalleHoraExtraDto: CreateDetalleHoraExtraDto) {
    return this.detalleHoraExtrasService.create(createDetalleHoraExtraDto);
  }

  @Get()
  findAll() {
    return this.detalleHoraExtrasService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.detalleHoraExtrasService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDetalleHoraExtraDto: UpdateDetalleHoraExtraDto) {
    return this.detalleHoraExtrasService.update(+id, updateDetalleHoraExtraDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.detalleHoraExtrasService.remove(+id);
  }
}
