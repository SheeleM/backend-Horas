import { UsuarioTurno } from 'src/usuario-turno/entities/usuario-turno.entity';
import { HorasExtra } from 'src/horasExtras/entities/horas-extra.entity';
import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Turno {
  @PrimaryGeneratedColumn()
  idTurno: number;

  @Column()
  nombre: string;

  
  @Index({ unique: true })
  @Column()
  codigo: string;

  @Column()
  horaInicio: Date;

  @Column()
  horaFin: Date;

  @Column()
  diaInicio: string;

  @Column()
  diaFin: string;

  @Column({ type: 'timestamp' })
  cread: Date;

  @Column({ type: 'timestamp' })
  actualizado: Date;

  @OneToMany(() => UsuarioTurno, (UsuarioTurno) => UsuarioTurno.turno)
  usuarioTurno: UsuarioTurno;


}
