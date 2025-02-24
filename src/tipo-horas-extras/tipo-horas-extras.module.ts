import { Module } from '@nestjs/common';
import { TipoHorasExtrasService } from './tipo-horas-extras.service';
import { TipoHorasExtrasController } from './tipo-horas-extras.controller';

@Module({
  controllers: [TipoHorasExtrasController],
  providers: [TipoHorasExtrasService],
})
export class TipoHorasExtrasModule {}
