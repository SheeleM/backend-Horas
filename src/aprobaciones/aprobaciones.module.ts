import { Module } from '@nestjs/common';
import { AprobacionesService } from './aprobaciones.service';
import { AprobacionesController } from './aprobaciones.controller';
import { DetalleHoraExtra } from 'src/detalle-hora-extras/entities/detalle-hora-extra.entity';
import { Aprobacione } from './entities/aprobacione.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DetalleHoraExtrasModule } from 'src/detalle-hora-extras/detalle-hora-extras.module';

@Module({
    imports:[TypeOrmModule.forFeature([Aprobacione]), DetalleHoraExtrasModule],
  controllers: [AprobacionesController],
  providers: [AprobacionesService, DetalleHoraExtra],
  exports:[DetalleHoraExtra]
})
export class AprobacionesModule {}
