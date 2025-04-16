import { Module } from '@nestjs/common';
import { UsuarioTurnoService } from './usuario-turno.service';
import { UsuarioTurnoController } from './usuario-turno.controller';
import { User } from 'src/user/entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from 'src/user/user.module';
import { TurnoModule } from 'src/turno/turno.module';
import { UsuarioTurno } from './entities/usuario-turno.entity';

@Module({
    imports:[TypeOrmModule.forFeature([User,UsuarioTurno]),UserModule,TurnoModule],
  controllers: [UsuarioTurnoController],
  providers: [UsuarioTurnoService],
  exports:[UsuarioTurnoService]
})
export class UsuarioTurnoModule {}
