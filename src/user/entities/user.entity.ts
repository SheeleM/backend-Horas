import { HorasExtra } from 'src/horasExtras/entities/horas-extra.entity';
import { Pregunta } from 'src/preguntas/entities/pregunta.entity';
import { Rol } from 'src/rol/entities/rol.entity';
import { UsuarioTurno } from 'src/usuario-turno/entities/usuario-turno.entity';
import { Entity, Column, PrimaryGeneratedColumn, DeleteDateColumn, OneToMany, ManyToOne } from 'typeorm';


@Entity()
export class User {

    @PrimaryGeneratedColumn()
    id:number;

    @Column()
    fullname:string;

    @Column()
    cedula:number;

    @Column()
    respuestaSeguridad:string;

    @Column()
    password:string;

    @DeleteDateColumn()
    deleteAt:Date;

    @OneToMany(() =>UsuarioTurno, UsuarioTurno =>UsuarioTurno.userTurno)
    usuarioTurno: UsuarioTurno;

    @ManyToOne(() => Rol, (rol) => rol.rolUser, { onDelete: 'CASCADE' })
    rol: Rol;//corregir

    @OneToMany(() => HorasExtra, HorasExtra => HorasExtra.usuario)
    userHoraExtra:HorasExtra;

    @ManyToOne(() => Pregunta, (preguntas) => preguntas.usuarioPreguntas, { onDelete: 'CASCADE' })
    preguntas: Pregunta;

    


}
