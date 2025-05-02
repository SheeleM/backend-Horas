import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThanOrEqual, MoreThanOrEqual } from 'typeorm';
import { HorasExtra } from './entities/horas-extra.entity';
import { CreateHorasExtraDto } from './dto/create-horas-extra.dto';
import { User } from '../user/entities/user.entity';
import { TipoHorasExtra } from '../tipo-horas-extras/entities/tipo-horas-extra.entity';
import { UsuarioTurno } from '../usuario-turno/entities/usuario-turno.entity';
import { Turno } from '../turno/entities/turno.entity';
import { Usuario } from 'src/usuarios/entities/usuario.entity';



// Definimos un enum para los tipos de hora extra
enum TipoHoraExtraEnum {
  ORDINARIA_DIURNA = 1,
  ORDINARIA_NOCTURNA = 2,
  FESTIVA_DIURNA = 3,
  FESTIVA_NOCTURNA = 4,
}

@Injectable()
export class HorasExtraService {
  constructor(
    @InjectRepository(HorasExtra)
    private horasExtraRepository: Repository<HorasExtra>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(UsuarioTurno)
    private usuarioTurnoRepository: Repository<UsuarioTurno>,
    @InjectRepository(TipoHorasExtra)
    private tipoHorasExtraRepository: Repository<TipoHorasExtra>,
    @InjectRepository(Turno)
    private turnoRepository: Repository<Turno>,
  ) {}

  async create(createHorasExtraDto: CreateHorasExtraDto, userId: number): Promise<HorasExtra> {
    const horasE = new HorasExtra();
    horasE.fecha = typeof createHorasExtraDto.fecha === 'string'
      ? new Date(createHorasExtraDto.fecha)
      : createHorasExtraDto.fecha;
    horasE.horaInicio = typeof createHorasExtraDto.horaInicio === 'string'
      ? new Date(createHorasExtraDto.horaInicio)
      : createHorasExtraDto.horaInicio;
    horasE.horaFin = typeof createHorasExtraDto.horaFin === 'string'
      ? new Date(createHorasExtraDto.horaFin)
      : createHorasExtraDto.horaFin;
    horasE.ticket = createHorasExtraDto.ticket;
    horasE.fechaCreacion = new Date();
    horasE.fechaActualizacion = new Date();
    horasE.usuarioE = userId;

    ///verificamos s el usuario existe en usuario turno
  
    const usuarioTurno = await this.usuarioTurnoRepository.findOne({
      where: { usuarioFK: userId , 
        // fechaInicio: LessThanOrEqual( horasE.fecha),
        // fechaFin: MoreThanOrEqual( horasE.fecha)
      },
      relations: ['userTurno', 'turno']
    });
    if (!usuarioTurno) {
      throw new NotFoundException(`UsuarioTurno con ID ${userId} no encontrado`);
    }

    // Asegúrate de que horasE.fecha es un Date antes de llamar a getTime
    if (

      horasE.fecha.getTime() >= usuarioTurno.fechaInicio.getTime() 
      && horasE.fecha.getTime() <= usuarioTurno.fechaFin.getTime()
    ) {
      horasE.turno = usuarioTurno.idUsuarioTurno;
      // console.log("ENTRO AL IF LUIS ME CAE MAL ", usuarioTurno.idUsuarioTurno)
    } else {
      horasE.turno = 0;
      // console.log("ENTRO AL ELSE LUIS ME CAE MAL ", usuarioTurno.idUsuarioTurno)
      // console.log("horasE.fec ", horasE.fecha)
      // console.log("horasE.fecInicio ", usuarioTurno.fechaInicio)
    }
    
    // ...asigna aquí otras relaciones si es necesario...

    return this.horasExtraRepository.save(horasE);
  }

  // Función auxiliar para verificar si una fecha es festivo
  private async verificarSiEsFestivo(fecha: Date): Promise<boolean> {
    // Implementar lógica para determinar si es festivo
    // Esta es una implementación básica. Deberías reemplazarla con tu lógica de negocio real.
    
    // Lista de fechas festivas en Colombia para 2025 (como ejemplo)
    const festivos2025 = [
      '2025-01-01', // Año Nuevo
      '2025-01-06', // Día de Reyes
      '2025-03-24', // Día de San José
      '2025-04-17', // Jueves Santo
      '2025-04-18', // Viernes Santo
      '2025-05-01', // Día del Trabajo
      '2025-06-09', // Ascensión del Señor
      '2025-06-30', // San Pedro y San Pablo
      '2025-07-20', // Día de la Independencia
      '2025-08-07', // Batalla de Boyacá
      '2025-08-18', // Asunción de la Virgen
      '2025-10-13', // Día de la Raza
      '2025-11-03', // Todos los Santos
      '2025-11-17', // Independencia de Cartagena
      '2025-12-08', // Día de la Inmaculada Concepción
      '2025-12-25', // Navidad
    ];
    
    // Formatear la fecha actual para compararla con la lista
    const fechaFormateada = fecha.toISOString().split('T')[0];
    
    return festivos2025.includes(fechaFormateada);
  }
}