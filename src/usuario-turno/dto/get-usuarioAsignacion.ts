import { IsBoolean, IsInt, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { UsuarioTurno } from "../entities/usuario-turno.entity";

export class GetUsuarioAsignacionDto {

  @IsInt()
  idUsuarioTurno: number;
// @IsInt()
  //idUsuarioTurno: number;
 

  @IsNotEmpty()
  fechaInicio: Date;

  @IsNotEmpty()
  fechaFin: Date;

  @IsString()
  codigo: string;

  constructor(entity: UsuarioTurno) {
    this.idUsuarioTurno = entity.idUsuarioTurno; // 👈 Asegúrate que viene de la entidad


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
