import { Turno } from "src/turno/entities/turno.entity";
import { TurnoController } from "src/turno/turno.controller";
import { User } from "src/user/entities/user.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, Timestamp } from "typeorm";

@Entity()
export class UsuarioTurno {

      @PrimaryGeneratedColumn()
      idUsuarioTurno: number;

      @Column()
      mes : string;

      @Column()
      turnoFK: number;

      @Column()
      usuarioFK:number;

      @Column({type:'timestamp'})
      fechaInicio: Date;

      @Column({type:'timestamp'})
      fechaFin: Date;


      @Column({type:'timestamp'})
      creado:Date;

      @Column({type:'timestamp'})
      actualizado: Date;

      @ManyToOne(() => User, (user) => user.usuarioTurno, { onDelete: 'CASCADE' })
      userTurno: User;

      @ManyToOne(() => Turno, (turno) => turno.usuarioTurno, { onDelete: 'CASCADE' })
      turno: Turno;

}
