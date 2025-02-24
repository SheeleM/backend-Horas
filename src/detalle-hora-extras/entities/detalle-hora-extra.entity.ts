import { Aprobacione } from "src/aprobaciones/entities/aprobacione.entity";
import { HorasExtra } from "src/horasExtras/entities/horas-extra.entity";
import { TipoHorasExtra } from "src/tipo-horas-extras/entities/tipo-horas-extra.entity";
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";


@Entity()
export class DetalleHoraExtra {

  @PrimaryGeneratedColumn()    
  idHoraExtraDetalle :number;

   @Column()
   horaExtraId:number;

   @Column()
   tipoHoraExtraId:number;

  @Column()
  cantidadHoraExtra:number;

  @Column()
  ValorCalculado:number;

  @ManyToOne(() => TipoHorasExtra, TipoHorasExtra => TipoHorasExtra.HoraExtraDetalle)
  tipoHora:TipoHorasExtra[];
  
  @ManyToOne(() => HorasExtra, HorasExtra => HorasExtra.HoraExtraDetalle)
  horaextra:HorasExtra;

  @OneToMany(() => Aprobacione, (aprobacion) => aprobacion.horaExtraAprobaciones)
  aprobaciones: Aprobacione ;


}
