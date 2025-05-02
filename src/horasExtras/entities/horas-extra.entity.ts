import { TipoHorasExtra } from "src/tipo-horas-extras/entities/tipo-horas-extra.entity";
import { User } from "src/user/entities/user.entity";
import { Turno } from "src/turno/entities/turno.entity";
import { UsuarioTurno } from "src/usuario-turno/entities/usuario-turno.entity";
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm"

@Entity()
export class HorasExtra {

    @PrimaryGeneratedColumn()
    idHoraExtra :number; 

    @Column({type:'timestamp'})
    fecha:Date;

    @Column()
    horaInicio: Date; 

    @Column()
    horaFin :Date;

    @Column()
    ticket: string;

    @Column()
    usuarioE: number;

    @Column()
    turno: number;

    @Column({type:'timestamp'})
    fechaCreacion: Date;

    @Column({type:'timestamp'})
    fechaActualizacion :Date;

    @ManyToOne(() => User, User => User.userHoraExtra)
    usuario: User;
     
    @ManyToOne(() => TipoHorasExtra, tipoHorasExtra => tipoHorasExtra.horasExtra)
    tipoHoraExtra: TipoHorasExtra;

    // Relación: Muchas horas extra pueden pertenecer a un solo usuario-turno
    @ManyToOne(() => UsuarioTurno, usuarioTurno => usuarioTurno.horasExtras)
    usuarioTurno: UsuarioTurno;

}
