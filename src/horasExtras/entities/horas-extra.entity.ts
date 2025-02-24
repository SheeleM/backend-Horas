import { DetalleHoraExtra } from "src/detalle-hora-extras/entities/detalle-hora-extra.entity";
import { User } from "src/user/entities/user.entity";
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm"

@Entity()
export class HorasExtra {

    @PrimaryGeneratedColumn()
    idHoraExtra :number; 

    @Column()
    idUsuarioTurnoFK: number; 

    @Column()
    horaInicio: Date; 

    @Column()
    horaFin :Date;

    @Column()
    descripcion: string;
    
    @Column()
    estado: boolean;

    @Column()
    valorHoraBase:number; 

    @Column({type:'timestamp'})
    @Column()
    fechaCreacion: Date;

    @Column({type:'timestamp'})
    @Column()
    fechaActualizacion :Date;

    @ManyToOne(() => User, User => User.userHoraExtra)
    usuario: User;
     
    @OneToMany(() => DetalleHoraExtra, (detalleHoraExtra) => detalleHoraExtra.horaextra)
    HoraExtraDetalle: DetalleHoraExtra[]; // Relación inversa
}
