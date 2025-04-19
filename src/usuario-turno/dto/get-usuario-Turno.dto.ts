import { IsBoolean, IsInt, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { UsuarioTurno } from "../entities/usuario-turno.entity";

export class GetUsuarioTurnoDto {

  @IsInt()
  idUsuarioTurno: number;
// @IsInt()
  //idUsuarioTurno: number;
  @IsInt()
  fullname: string;

  @IsNotEmpty()
  fechaInicio: Date;

  @IsNotEmpty()
  fechaFin: Date;

  @IsString()
  codigo: string;

  constructor(entity: UsuarioTurno) {
    this.idUsuarioTurno = entity.idUsuarioTurno; // 👈 Asegúrate que viene de la entidad

    // More robust handling of the relationship
    this.fullname = entity.userTurno?.fullname || 
                   `User ID: ${entity.usuarioFK}` || 
                   'Unknown';
    this.fechaInicio = entity.fechaInicio;
    this.fechaFin = entity.fechaFin;
    this.codigo = entity.turno?.codigo ||
                   `Turno ID: ${entity.turnoFK}` ||
                   'Unknown';
    // For debugging
    console.log("User relation:", entity.userTurno);
    console.log("User FK:", entity.usuarioFK);
  }
}
