import { UsuarioTurno } from 'src/usuario-turno/entities/usuario-turno.entity';
import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn
} from 'typeorm';

@Entity()
export class Turno {
  @PrimaryGeneratedColumn()
  idTurno: number;

  @Column()
  nombre: string;

  @Column()
  codigo: string;

  @Column({ type: 'time' })
  horaInicio: Date;

  @Column({ type: 'time' })
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
