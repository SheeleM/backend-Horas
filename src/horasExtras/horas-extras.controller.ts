import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { HorasExtrasService } from './horas-extras.service';
import { CreateHorasExtraDto } from './dto/create-horas-extra.dto';
import { UpdateHorasExtraDto } from './dto/update-horas-extra.dto';

@Controller('horas-extras')
export class HorasExtrasController {
  constructor(private readonly horasExtrasService: HorasExtrasService) {}

  @Post()
  create(@Body() createHorasExtraDto: CreateHorasExtraDto) {
    return this.horasExtrasService.create(createHorasExtraDto);
  }

  @Get()
  findAll() {
    return this.horasExtrasService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.horasExtrasService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateHorasExtraDto: UpdateHorasExtraDto) {
    return this.horasExtrasService.update(+id, updateHorasExtraDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.horasExtrasService.remove(+id);
  }
}
