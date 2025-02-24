import { Module } from '@nestjs/common';
import { HorasExtrasService } from './horas-extras.service';
import { HorasExtrasController } from './horas-extras.controller';
import { UsuarioTurno } from 'src/usuario-turno/entities/usuario-turno.entity';
import { HorasExtra } from './entities/horas-extra.entity';
import { UsuarioTurnoModule } from 'src/usuario-turno/usuario-turno.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
   imports:[TypeOrmModule.forFeature([HorasExtra]),UsuarioTurnoModule],
  controllers: [HorasExtrasController],
  providers: [HorasExtrasService,UsuarioTurno],
  exports:[UsuarioTurno]
})
export class HorasExtrasModule {}
