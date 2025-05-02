
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, Timestamp } from "typeorm"

@Entity()
export class Aprobacione {

    @PrimaryGeneratedColumn()
    idAprobacion :number; 

    @Column()
    horaExtraIdFK:number;

    @Column()
    estado :boolean;

    @Column()
    comentario:string; 

    @Column({type:'timestamp'})
    fechaAprobacion: Date;

    @Column({type:'timestamp'})
    fechaActualizacion: Date;
}
