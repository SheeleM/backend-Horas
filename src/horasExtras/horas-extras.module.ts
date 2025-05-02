import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HorasExtra } from './entities/horas-extra.entity';
import { User } from '../user/entities/user.entity';
import { UsuarioTurno } from '../usuario-turno/entities/usuario-turno.entity';
import { TipoHorasExtra } from '../tipo-horas-extras/entities/tipo-horas-extra.entity';
import { Turno } from '../turno/entities/turno.entity';
import { HorasExtraService } from './horas-extras.service';
import { HorasExtrasController } from './horas-extras.controller';
import { AuthModuleOptions } from '@nestjs/passport';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      HorasExtra,
      User,
      UsuarioTurno,
      TipoHorasExtra,
      Turno,
      AuthModuleOptions,
    ]),
  ],
  controllers: [HorasExtrasController],
  providers: [HorasExtraService],
  exports: [HorasExtraService],
})
export class HorasExtrasModule {}
