import { IsDecimal, IsInt } from "class-validator";

export class CreateDetalleHoraExtraDto {

    @IsInt()
    id: number;
  
    @IsInt()
    horaExtraId: number;
  
    @IsInt()
    tipoHoraExtraId: number;
  
    @IsInt()
    cantidadHoras: number;
  
    @IsDecimal()
    valorCalculado: number;
}
