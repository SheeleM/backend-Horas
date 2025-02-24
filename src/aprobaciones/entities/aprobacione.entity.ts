import { DetalleHoraExtra } from "src/detalle-hora-extras/entities/detalle-hora-extra.entity";
import { HorasExtra } from "src/horasExtras/entities/horas-extra.entity";
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
    
    @ManyToOne(() => DetalleHoraExtra, (DetalleHoraExtra) => DetalleHoraExtra.aprobaciones, { onDelete: 'CASCADE' })
    horaExtraAprobaciones: DetalleHoraExtra ;
}
