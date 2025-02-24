import { DetalleHoraExtra } from "src/detalle-hora-extras/entities/detalle-hora-extra.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm"

@Entity()
export class TipoHorasExtra {

    @PrimaryGeneratedColumn()
    id :number;
    
    @Column()
    nombre: string;

    @Column()
    factorMultiplicador: number;

    @Column()
    formula: string;

    @Column()
    desctripcion: string;

    @Column({type:'timestamp'})
    @Column()
    creado: Date;

    @Column({type:'timestamp'})
    @Column()
    actualizado: Date;

    @OneToMany(() => DetalleHoraExtra, (detalleHoraExtra) => detalleHoraExtra.tipoHora)
    HoraExtraDetalle: DetalleHoraExtra[];
    
    
}
