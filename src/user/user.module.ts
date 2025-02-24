import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Rol } from 'src/rol/entities/rol.entity';
import { Pregunta } from 'src/preguntas/entities/pregunta.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Rol, Pregunta])],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
