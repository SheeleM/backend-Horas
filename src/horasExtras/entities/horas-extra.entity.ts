import { TipoHorasExtra } from "src/tipo-horas-extras/entities/tipo-horas-extra.entity";
import { User } from "src/user/entities/user.entity";
import { Turno } from "src/turno/entities/turno.entity";
import { UsuarioTurno } from "src/usuario-turno/entities/usuario-turno.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm"

// Enum para los estados de la hora extra
export enum EstadoHoraExtra {
    PENDIENTE = 'PENDIENTE',
    APROBADA = 'APROBADA',
    RECHAZADA = 'RECHAZADA',
    EN_REVISION = 'EN_REVISION'
}

@Entity()
export class HorasExtra {

    @PrimaryGeneratedColumn()
    idHoraExtra :number; 

    @Column({type:'timestamp'})
    fecha:Date;
    // ✅ Cambio importante: usar type 'time' para almacenar solo HH:MM:SS
    @Column({ type: 'time' })
    horaInicio: string; 

    // ✅ Cambio importante: usar type 'time' para almacenar solo HH:MM:SS
    @Column({ type: 'time' })
    horaFin :string;


    @Column()
    ticket: string;

    @Column()
    usuarioE: number;

    @Column()
    turno: number;

    @Column({type:'timestamp'})
    fechaCreacion: Date;

    @Column({type:'timestamp'})
    fechaActualizacion :Date;

    // Nuevo campo: cantidad de horas extra
   @Column('float', { nullable: true })
cantidadHoras: number | null;

    //@Column()
    //tipoDeHora: string; // Nuevo campo para el tipo calculado

        // Campo para almacenar el ID del tipo de hora extra (puede ser null)
    @Column({ nullable: true, type: 'int' })
    tipoHoraExtraId: number | null;

    @ManyToOne(() => User, User => User.userHoraExtra)
    usuario: User;
     
    //@ManyToOne(() => TipoHorasExtra, tipoHorasExtra => tipoHorasExtra.horasExtra)
    //tipoHoraExtra: TipoHorasExtra;

      @ManyToOne(() => TipoHorasExtra, tipoHorasExtra => tipoHorasExtra.horasExtra, { 
        nullable: true,
        onDelete: 'SET NULL' 
    })
    @JoinColumn({ name: 'tipoHoraExtraId' })
    tipoHoraExtra: TipoHorasExtra | null;;

    // Relación: Muchas horas extra pueden pertenecer a un solo usuario-turno
    @ManyToOne(() => UsuarioTurno, usuarioTurno => usuarioTurno.horasExtras, {
        onDelete: 'CASCADE' // Agregar esta línea
    })
    usuarioTurno: UsuarioTurno;

    @Column({
      type: 'enum',
      enum: EstadoHoraExtra,
      default: EstadoHoraExtra.PENDIENTE
    })
    estado: EstadoHoraExtra;
}
