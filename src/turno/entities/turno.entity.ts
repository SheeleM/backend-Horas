import { UsuarioTurno } from 'src/usuario-turno/entities/usuario-turno.entity';
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

  @Column({ unique: true })
  @Index({ unique: true })
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
