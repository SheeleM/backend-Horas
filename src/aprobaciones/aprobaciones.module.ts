import { Module } from '@nestjs/common';
import { AprobacionesService } from './aprobaciones.service';
import { AprobacionesController } from './aprobaciones.controller';
import { Aprobacione } from './entities/aprobacione.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
    imports:[TypeOrmModule.forFeature([Aprobacione])],
  controllers: [AprobacionesController],
  providers: [AprobacionesService],
  exports:[]
})
export class AprobacionesModule {}
