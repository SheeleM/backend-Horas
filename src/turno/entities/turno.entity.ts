import { UsuarioTurno } from "src/usuario-turno/entities/usuario-turno.entity";
import { Column, Entity, Generated, OneToMany, PrimaryGeneratedColumn, Timestamp } from "typeorm"

@Entity()
export class Turno {

    @PrimaryGeneratedColumn()
    idTurno: number;

    @Column()
    codigo: string;

    @Column()
    horaInicio:Date;

    @Column()
    horaFin:Date;

    @Column({type:'timestamp'})
    guardiaInicio: Date;

    @Column({type:'timestamp'})
    guardiaFin: Date;

    @Column({type:'timestamp'})
    cread: Date;
  
    @Column({type:'timestamp'})
    actualizado:Date; 

    @OneToMany(() =>UsuarioTurno, UsuarioTurno =>UsuarioTurno.turno)
    usuarioTurno:UsuarioTurno;


}
