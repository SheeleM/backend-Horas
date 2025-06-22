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

    @Column({ type: 'time' })
    horaInicio: string;

    @Column({ type: 'time' })
    horaFin: string;

    
    @Column({ type: 'time',nullable: true })
    horaInicio2?: string;

    @Column({ type: 'time',nullable: true })
    horaFin2?: string;

      @Column({ type: 'boolean',nullable: true })
    esFestivo?: boolean;

    @Column({ type: 'boolean',nullable: true })
    esDomingo?: boolean;

    @Column({type:'timestamp'})
    creado: Date;

    @Column({type:'timestamp'})
    actualizado: Date;

    // Relación: Un tipo de hora extra puede estar en varias horas extra
    @OneToMany(() => HorasExtra, (horasExtra) => horasExtra.tipoHoraExtra)
    horasExtra: HorasExtra[];
}
