import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HorasExtra } from './entities/horas-extra.entity';
import { CreateHorasExtraDto } from './dto/create-horas-extra.dto';
import { User } from '../user/entities/user.entity';
import { TipoHorasExtra } from '../tipo-horas-extras/entities/tipo-horas-extra.entity';
import { UsuarioTurno } from '../usuario-turno/entities/usuario-turno.entity';
import { Turno } from '../turno/entities/turno.entity';
import { getDay, getHours } from 'date-fns';

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
    console.log('>>> [HorasExtraService.create] userId recibido:', userId);
    if (!userId) {
      throw new BadRequestException('El ID de usuario es requerido');
    }

    // Crear una nueva entidad HorasExtra
    const horasE = new HorasExtra();

    // Validar que la fecha existe
    if (!createHorasExtraDto.fecha) {
      throw new BadRequestException('La fecha es requerida');
    }
    
    // Validar que horaInicio y horaFin existen
    if (!createHorasExtraDto.horaInicio) {
      throw new BadRequestException('horaInicio es requerida');
    }
    if (!createHorasExtraDto.horaFin) {
      throw new BadRequestException('horaFin es requerida');
    }

    // ============ SOLUCIÓN PARA EVITAR CONVERSIÓN UTC ============
    // En lugar de crear objetos Date, almacenamos los strings ISO directamente
    // y utilizamos objetos Date solo para cálculos o validaciones específicas
    
    // 1. Para la fecha, extraer solo la parte de la fecha (YYYY-MM-DD)
    let fechaString: string;
    if (typeof createHorasExtraDto.fecha === 'string') {
      // Si es un string ISO completo, extraer solo la parte de la fecha
      const fechaValue = createHorasExtraDto.fecha as string;
      fechaString = fechaValue.split('T')[0];
    } else {
      // Si es un objeto Date, convertirlo a un string de fecha
      const d = createHorasExtraDto.fecha;
      fechaString = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    }
    
    // 2. Para las horas, extraer y mantener la hora exacta
    let horaInicioString: string;
    let horaFinString: string;
    
    if (typeof createHorasExtraDto.horaInicio === 'string') {
      horaInicioString = createHorasExtraDto.horaInicio;
    } else {
      const d = createHorasExtraDto.horaInicio;
      horaInicioString = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}T${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}:${String(d.getSeconds()).padStart(2, '0')}`;
    }
    
    if (typeof createHorasExtraDto.horaFin === 'string') {
      horaFinString = createHorasExtraDto.horaFin;
    } else {
      const d = createHorasExtraDto.horaFin;
      horaFinString = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}T${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}:${String(d.getSeconds()).padStart(2, '0')}`;
    }
    
    // Asignar los strings directamente en la entidad
    // La base de datos los almacenará tal cual, sin convertir a UTC
    horasE.fecha = fechaString as any; // Casting para compatibilidad con TypeORM
    horasE.horaInicio = horaInicioString as any;
    horasE.horaFin = horaFinString as any;
    
    console.log('>>> [HorasExtraService.create] Fecha guardada:', fechaString);
    console.log('>>> [HorasExtraService.create] Hora inicio guardada:', horaInicioString);
    console.log('>>> [HorasExtraService.create] Hora fin guardada:', horaFinString);
    
    // =========== PARA CÁLCULOS Y VALIDACIONES ===========
    // Crear objetos Date temporales para hacer cálculos 
    // (estos no se guardan en la base de datos)
    
    const fechaObj = new Date(fechaString + 'T00:00:00');
    const horaInicioObj = new Date(horaInicioString);
    const horaFinObj = new Date(horaFinString);
    
    // Si la hora fin es menor que la hora inicio, podría ser del día siguiente
    // Esto solo afecta a los cálculos, no a lo que se guarda
    let horaFinCalculo = new Date(horaFinObj);
    if (horaFinObj.getTime() < horaInicioObj.getTime()) {
      horaFinCalculo.setDate(horaFinCalculo.getDate() + 1);
    }
    
    horasE.ticket = createHorasExtraDto.ticket;
    horasE.fechaCreacion = new Date(); // Este sí es un timestamp
    horasE.fechaActualizacion = new Date(); // Este sí es un timestamp
    horasE.usuarioE = userId;
    horasE.turno = 0;

    // Verificar usuario en usuario turno
    const usuarioTurno = await this.usuarioTurnoRepository.findOne({
      where: { usuarioFK: userId },
      relations: ['userTurno', 'turno']
    });

    if (usuarioTurno) {
      if (fechaObj.getTime() >= usuarioTurno.fechaInicio.getTime() && 
          fechaObj.getTime() <= usuarioTurno.fechaFin.getTime()) {
        horasE.turno = usuarioTurno.idUsuarioTurno;
        horasE.usuarioTurno = usuarioTurno; // Asignar la relación completa
      }
    }

    // Calcular cantidadHoras usando los objetos Date para cálculos
    let numeroHoras = 0;
    const diffMs = horaFinCalculo.getTime() - horaInicioObj.getTime();
    numeroHoras = diffMs / (1000 * 60 * 60);
    horasE.cantidadHoras = numeroHoras;

    // Determinar el tipo de hora extra
    let tipoHora = '';
    
    // Extraer componentes de hora y fecha para lógica de negocio
    const diaSemana = horaInicioObj.getDay(); // 0 es domingo
    const hora = horaInicioObj.getHours();
    const esFestivo = await this.verificarSiEsFestivo(fechaObj);

    if (esFestivo) {
      if (hora >= 21 || hora < 6) {
        tipoHora = 'FESTIVA NOCTURNA';
      } else if (hora >= 6 && hora < 21) {
        tipoHora = 'FESTIVA DIURNA';
      } else {
        tipoHora = 'FESTIVA';
      }
    } else if (diaSemana === 0) { // 0 es domingo
      if (hora >= 21 || hora < 6) {
        tipoHora = 'DOMINICAL NOCTURNA';
      } else if (hora >= 6 && hora < 21) {
        tipoHora = 'DOMINICAL DIURNA';
      } else {
        tipoHora = 'DOMINICAL';
      }
    } else if (hora >= 21 || hora < 6) {
      tipoHora = 'NOCTURNA';
    } else {
      tipoHora = 'DIURNA';
    }
    
    horasE.tipoDeHora = tipoHora;
    console.log('>>> [HorasExtraService.create] Tipo de hora:', tipoHora);

    // Buscar y asignar usuario si existe
    if (userId) {
      const usuario = await this.userRepository.findOne({ where: { id: userId } });
      if (usuario) {
        horasE.usuario = usuario;
      }
    }

    // Guardar la hora extra
    return this.horasExtraRepository.save(horasE);
  }

  // Verificar si es festivo 
  private async verificarSiEsFestivo(fecha: Date): Promise<boolean> {
    // Formatear la fecha como YYYY-MM-DD
    const year = fecha.getFullYear();
    const month = String(fecha.getMonth() + 1).padStart(2, '0'); // +1 porque getMonth() devuelve 0-11
    const day = String(fecha.getDate()).padStart(2, '0');
    const fechaFormateada = `${year}-${month}-${day}`;
    
    console.log('>>> [HorasExtraService.verificarSiEsFestivo] Fecha formateada:', fechaFormateada);
    
    const festivos2025 = [
      '2025-01-01', '2025-01-06', '2025-03-24', '2025-04-17', '2025-04-18',
      '2025-05-01', '2025-06-09', '2025-06-30', '2025-07-20', '2025-08-07',
      '2025-08-18', '2025-10-13', '2025-11-03', '2025-11-17', '2025-12-08',
      '2025-12-25'
    ];
    
    return festivos2025.includes(fechaFormateada);
  }
}