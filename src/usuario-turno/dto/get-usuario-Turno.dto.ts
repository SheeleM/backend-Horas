import { IsBoolean, IsInt, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { UsuarioTurno } from "../entities/usuario-turno.entity";
import { CreateTurnoDto } from "src/turno/dto/create-turno.dto";
import { Turno } from "src/turno/entities/turno.entity";

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


  turno: Turno;
  
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
    this.turno =  entity.turno

  }
}
