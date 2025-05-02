import { HorasExtra } from "src/horasExtras/entities/horas-extra.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm"

@Entity()
export class TipoHorasExtra {

    @PrimaryGeneratedColumn()
    id :number;
    
    @Column({ unique: true })
    codigoHoraExtra: string;

    @Column()
    descripcion: string;

    @Column({ type: 'timestamp' })
    horaInicio: Date;

    @Column({ type: 'timestamp' })
    horaFin: Date;

    @Column({type:'timestamp'})

    creado: Date;

    @Column({type:'timestamp'})
    actualizado: Date;

    // Relación: Un tipo de hora extra puede estar en varias horas extra
    @OneToMany(() => HorasExtra, (horasExtra) => horasExtra.tipoHoraExtra)
    horasExtra: HorasExtra[];
}
