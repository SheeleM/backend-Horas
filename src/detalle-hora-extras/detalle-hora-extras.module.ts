import { Module } from '@nestjs/common';
import { DetalleHoraExtrasService } from './detalle-hora-extras.service';
import { DetalleHoraExtrasController } from './detalle-hora-extras.controller';
import { HorasExtra } from 'src/horasExtras/entities/horas-extra.entity';
import { TipoHorasExtra } from 'src/tipo-horas-extras/entities/tipo-horas-extra.entity';
import { DetalleHoraExtra } from './entities/detalle-hora-extra.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TipoHorasExtrasModule } from 'src/tipo-horas-extras/tipo-horas-extras.module';
import { HorasExtrasModule } from 'src/horasExtras/horas-extras.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([DetalleHoraExtra, TipoHorasExtra, HorasExtra]), // Asegúrate de incluir todas las entidades necesarias
    TipoHorasExtrasModule,
    HorasExtrasModule,
  ],
  controllers: [DetalleHoraExtrasController],
  providers: [DetalleHoraExtrasService],
  exports: [DetalleHoraExtrasService, TypeOrmModule],
})
export class DetalleHoraExtrasModule {}