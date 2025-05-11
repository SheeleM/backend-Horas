import { Turno } from "src/turno/entities/turno.entity";
import { TurnoController } from "src/turno/turno.controller";
import { User } from "src/user/entities/user.entity";
import { HorasExtra } from "src/horasExtras/entities/horas-extra.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, Timestamp } from "typeorm";

@Entity()
export class UsuarioTurno {

      @PrimaryGeneratedColumn()
      idUsuarioTurno: number;

    //  @Column()
     // mes : number;

      @Column()
      turnoFK: number;

      @Column()
      usuarioFK:number;

      @Column({type:'timestamp'})
      fechaInicio: Date;

      @Column({type:'timestamp'})
      fechaFin: Date;


      @Column({type:'timestamp'})
      creado:Date;

      @Column({type:'timestamp'})
      actualizado: Date;

      /*
      @ManyToOne(() => User, (user) => user.usuarioTurno, { onDelete: 'CASCADE' })
      userTurno: User;
*/
@ManyToOne(() => User, (user) => user.usuarioTurno, { 
      onDelete: 'CASCADE',
      eager: true // This will always load the relation
    })
    @JoinColumn({ name: 'usuarioFK' }) // This explicitly defines which column holds the foreign key
    userTurno: User;

    /*
      @ManyToOne(() => Turno, (turno) => turno.usuarioTurno, { onDelete: 'CASCADE' })
      turno: Turno;
*/
@ManyToOne(() => Turno, (turno) => turno.usuarioTurno, { 
      onDelete: 'CASCADE',
      eager: true // si lo quieres traer siempre, opcional
    })
    @JoinColumn({ name: 'turnoFK' }) // <- Esto también puedes incluirlo
    turno: Turno;

    // Relación: Un usuario-turno puede tener muchas horas extra
    @OneToMany(() => HorasExtra, horasExtra => horasExtra.usuarioTurno, {
        onDelete: 'CASCADE' // Agregar esta línea
    })
    horasExtras: HorasExtra[];

}
