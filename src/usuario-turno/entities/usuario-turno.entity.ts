import { Turno } from "src/turno/entities/turno.entity";
import { TurnoController } from "src/turno/turno.controller";
import { User } from "src/user/entities/user.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, Timestamp } from "typeorm";

@Entity()
export class UsuarioTurno {

      @PrimaryGeneratedColumn()
      idUsuarioTurno: number;

      @Column()
      turnoFK: number;

      @Column()
      usuarioFL:number;

      @Column({type:'timestamp'})
      @Column()
      fechaInicio: Date;

      @Column({type:'timestamp'})
      @Column()
      fechaFin: Date;

      @Column()
      activo:boolean;

      @Column({type:'timestamp'})
      @Column()
      creado:Date;

      @Column({type:'timestamp'})
      @Column()
      actualizado: Date;

      @ManyToOne(() => User, (user) => user.usuarioTurno, { onDelete: 'CASCADE' })
      userTurno: User;

      @ManyToOne(() => Turno, (turno) => turno.usuarioTurno, { onDelete: 'CASCADE' })
      turno: Turno;

}
