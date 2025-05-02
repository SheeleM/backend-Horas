import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TipoHorasExtrasService } from './tipo-horas-extras.service';
import { TipoHorasExtrasController } from './tipo-horas-extras.controller';
import { TipoHorasExtra } from './entities/tipo-horas-extra.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TipoHorasExtra])],
  controllers: [TipoHorasExtrasController],
  providers: [TipoHorasExtrasService],
  exports: [TipoHorasExtrasService],
})
export class TipoHorasExtrasModule {}
