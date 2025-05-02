import { HorasExtra } from 'src/horasExtras/entities/horas-extra.entity';
import { Pregunta } from 'src/preguntas/entities/pregunta.entity';
import { Rol } from 'src/rol/entities/rol.entity';
import { UsuarioTurno } from 'src/usuario-turno/entities/usuario-turno.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  DeleteDateColumn,
  OneToMany,
  ManyToOne,
  Unique,
} from 'typeorm';

@Entity()

export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  fullname: string;

  @Column({ unique: true })
  cedula: number;

  @Column()
  respuestaSeguridad: string;

  @Column({select: true})
  password: string;

  @Column({ type: 'boolean', default: true })
  estado: boolean;

  @DeleteDateColumn()
  deleteAt: Date;

  @OneToMany(() => UsuarioTurno, (UsuarioTurno) => UsuarioTurno.userTurno)
  usuarioTurno: UsuarioTurno[]; // <-- Debe ser un array

  @ManyToOne(() => Rol, (rol) => rol.rolUser, { onDelete: 'CASCADE' })
  rol: Rol; //corregir

  @OneToMany(() => HorasExtra, (HorasExtra) => HorasExtra.usuario)
  userHoraExtra: HorasExtra[]; // <-- Debe ser un array

  @ManyToOne(() => Pregunta, (preguntas) => preguntas.usuarioPreguntas, {
    onDelete: 'CASCADE',
  })
  preguntas: Pregunta;
}
