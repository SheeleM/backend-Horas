import { Module } from '@nestjs/common';
import { PreguntasService } from './preguntas.service';
import { PreguntasController } from './preguntas.controller';
import { Pregunta } from './entities/pregunta.entity';
import { User } from 'src/user/entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports:[TypeOrmModule.forFeature([Pregunta,User])],
  controllers: [PreguntasController],
  providers: [PreguntasService],
  exports: [PreguntasService],

})
export class PreguntasModule {}
