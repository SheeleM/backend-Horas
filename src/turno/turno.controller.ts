import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { TurnoService } from './turno.service';
import { CreateTurnoDto } from './dto/create-turno.dto';
import { UpdateTurnoDto } from './dto/update-turno.dto';
import { Turno } from './entities/turno.entity';

@Controller('turno')
export class TurnoController {
  constructor(private readonly turnoService: TurnoService) {}

  @Post()
  create(@Body() createTurnoDto: CreateTurnoDto): Promise<Turno> {
    return this.turnoService.create(createTurnoDto);
  }

  @Get()
  findAll(): Promise<Turno[]> {
    console.log("NUEVOOOO VIEJOOOOOOOOOOOOOOO");

    return this.turnoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Turno> {
    return this.turnoService.findOne(+id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateTurnoDto: UpdateTurnoDto) {
    return this.turnoService.update(+id, updateTurnoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.turnoService.remove(+id);
  }

// GET /turnos/nombres → trae solo los nombres
@Post('codigo')
findOnlyNames(): Promise<any[]> {
  console.log("NUEVOOOO METODO");
  return this.turnoService.findOnlyNames();
}


}
