import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { EstadoHoraExtra } from './entities/horas-extra.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository, Between, In } from 'typeorm';
import { HorasExtra } from './entities/horas-extra.entity';
import { CreateHorasExtraDto } from './dto/create-horas-extra.dto';
import { UpdateHorasExtraDto } from './dto/update-horas-extra.dto';
import { User } from '../user/entities/user.entity';
import { TipoHorasExtra } from '../tipo-horas-extras/entities/tipo-horas-extra.entity';
import { UsuarioTurno } from '../usuario-turno/entities/usuario-turno.entity';
import { Turno } from '../turno/entities/turno.entity';
import { FiltrosHorasExtraDto } from './dto/FiltrosHorasExtraDto';

interface SegmentoHora {
  horaInicio: Date;
  horaFin: Date;
  cantidadHoras: number;
  tipoHoraExtra: TipoHorasExtra | null;
}

interface RangoTipo {
  tipoHoraExtra: TipoHorasExtra;
  horaInicio: string;
  horaFin: string;
}

interface PuntoTiempo {
  tiempo: Date;
  tiposActivos: Set<number>; // IDs de tipos activos en este punto
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
    private turnoRepository: Repository<Turno>
  ) {}

async create(createHorasExtraDto: CreateHorasExtraDto, userId: number): Promise<HorasExtra[]> {
  console.log('>>> [HorasExtraService.create] userId recibido:', userId);
  if (!userId) {
    throw new BadRequestException('El ID de usuario es requerido');
  }

  // Validaciones básicas
  if (!createHorasExtraDto.fecha) {
    throw new BadRequestException('La fecha es requerida');
  }
  
  if (!createHorasExtraDto.horaInicio || !createHorasExtraDto.horaFin) {
    throw new BadRequestException('Las horas de inicio y fin son requeridas');
  }

  // Validar formato de horas
  if (!this.validarFormatoHora(createHorasExtraDto.horaInicio) || 
      !this.validarFormatoHora(createHorasExtraDto.horaFin)) {
    throw new BadRequestException('Las horas deben estar en formato HH:mm');
  }

  // ============ PROCESAMIENTO DE FECHAS ============
  const fechaString = this.procesarFecha(createHorasExtraDto.fecha);
  const fechaBase = new Date(fechaString + 'T00:00:00');
  
  const horaInicioObj = this.crearFechaConHora(fechaBase, createHorasExtraDto.horaInicio);
  const horaFinObj = this.crearFechaConHora(fechaBase, createHorasExtraDto.horaFin);
  
  // ✅ NUEVA LÓGICA: Determinar si cruza medianoche
  let horaFinCalculo = new Date(horaFinObj);
  let cruzaMedianoche = false;
  
  if (horaFinObj.getTime() <= horaInicioObj.getTime()) {
    horaFinCalculo.setDate(horaFinCalculo.getDate() + 1);
    cruzaMedianoche = true;
  }

  // Validar que el rango tenga sentido (mínimo 1 minuto)
  const duracionMinutos = (horaFinCalculo.getTime() - horaInicioObj.getTime()) / (1000 * 60);
  if (duracionMinutos < 1) {
    throw new BadRequestException('La duración mínima debe ser de 1 minuto');
  }

  // ✅ NUEVA VALIDACIÓN: Verificar solapamiento con horario laboral
  await this.validarSolapamientoConTurno(
    horaInicioObj,
    horaFinCalculo,
    fechaBase,
    userId
  );

  console.log('>>> [HorasExtraService.create] ✅ Validación de horario laboral pasada');

  // ============ OBTENER DATOS COMUNES ============

  
  const usuario = await this.userRepository.findOne({ where: { id: userId } });
  if (!usuario) {
    throw new BadRequestException('Usuario no encontrado');
  }

  let todosLosRegistros: HorasExtra[] = [];

  // ✅ NUEVA LÓGICA: División por días si cruza medianoche
  if (cruzaMedianoche) {
    console.log('>>> [HorasExtraService.create] 🌙 El rango cruza medianoche - Dividiendo por días');
    
    // ===== PRIMER DÍA: Desde hora inicio hasta 23:59:59 =====
    const finPrimerDia = new Date(fechaBase);
    finPrimerDia.setHours(23, 59, 59, 999);
    
    console.log('>>> Procesando PRIMER DÍA:', {
      fecha: fechaString,
      desde: horaInicioObj.toLocaleTimeString(),
      hasta: '23:59:59'
    });
    
    const registrosPrimerDia = await this.procesarDiaCompleto(
      horaInicioObj,
      finPrimerDia,
      fechaString,
      createHorasExtraDto.ticket,
      userId,
      usuario
    );
    
    todosLosRegistros.push(...registrosPrimerDia);

    // ===== SEGUNDO DÍA: Desde 00:00:00 hasta hora fin =====
    const fechaSiguienteString = this.obtenerFechaSiguiente(fechaString);
    const inicioSegundoDia = new Date(fechaBase);
    inicioSegundoDia.setDate(inicioSegundoDia.getDate() + 1);
    inicioSegundoDia.setHours(0, 0, 0, 0);
    
    console.log('>>> Procesando SEGUNDO DÍA:', {
      fecha: fechaSiguienteString,
      desde: '00:00:00',
      hasta: horaFinCalculo.toLocaleTimeString()
    });
    
    const registrosSegundoDia = await this.procesarDiaCompleto(
      inicioSegundoDia,
      horaFinCalculo,
      fechaSiguienteString,
      createHorasExtraDto.ticket,
      userId,
      usuario
    );
    
    todosLosRegistros.push(...registrosSegundoDia);
    
  } else {
    // ===== CASO NORMAL: Un solo día =====
    console.log('>>> [HorasExtraService.create] 📅 Rango en un solo día');
    
    const registrosUnDia = await this.procesarDiaCompleto(
      horaInicioObj,
      horaFinCalculo,
      fechaString,
      createHorasExtraDto.ticket,
      userId,
      usuario
    );
    
    todosLosRegistros.push(...registrosUnDia);
  }

  console.log('>>> [HorasExtraService.create] ✅ Total de registros creados:', {
    cantidad: todosLosRegistros.length,
    cruzaMedianoche: cruzaMedianoche,
    dias: cruzaMedianoche ? 2 : 1
  });

  return todosLosRegistros;
}

/**
 * ✅ NUEVO MÉTODO: Procesa un día completo con la lógica de tipos de hora
 */
private async procesarDiaCompleto(
  horaInicio: Date,
  horaFin: Date,
  fechaString: string,
  ticket: string,
  userId: number,
  usuario: User
): Promise<HorasExtra[]> {
  
  console.log('>>> [procesarDiaCompleto] Procesando día:', {
    fecha: fechaString,
    inicio: horaInicio.toLocaleTimeString(),
    fin: horaFin.toLocaleTimeString()
  });

  // Buscar usuario turno para esta fecha específica
  const fechaParaBusqueda = new Date(fechaString + 'T12:00:00'); // Usar mediodía para evitar problemas de zona horaria
  const { usuarioTurnoEntity, usuarioTurnoId } = await this.buscarUsuarioTurnoPorFecha(userId, fechaParaBusqueda);

  console.log('>>> [procesarDiaCompleto] Usuario turno encontrado:', {
    usuarioTurnoId: usuarioTurnoId,
    tieneAsignacion: usuarioTurnoEntity ? 'SÍ' : 'NO',
    fecha: fechaString
  });

  // Dividir por tipos de hora extra para este rango específico
  const segmentosHoras = await this.dividirPorTiposDeHoraCompleto(horaInicio, horaFin);

  console.log('>>> [procesarDiaCompleto] Segmentos encontrados para', fechaString, ':', segmentosHoras.length);

  // Crear registros para cada segmento
  const horasExtrasCreadas: HorasExtra[] = [];

  for (const segmento of segmentosHoras) {
    const horasExtra = new HorasExtra();
    
    const inicioTimeFormatted = this.formatearSoloHora(segmento.horaInicio);
    const finTimeFormatted = this.formatearSoloHora(segmento.horaFin);
    
    // ✅ IMPORTANTE: Usar la fecha específica del día que se está procesando
    horasExtra.fecha = fechaString as any;
    horasExtra.horaInicio = inicioTimeFormatted;
    horasExtra.horaFin = finTimeFormatted;
    horasExtra.ticket = ticket;
    horasExtra.fechaCreacion = new Date();
    horasExtra.fechaActualizacion = new Date();
    horasExtra.usuarioE = userId;
    
    // Asignación del usuario turno
    horasExtra.turno = usuarioTurnoId;
    if (usuarioTurnoEntity) {
      horasExtra.usuarioTurno = usuarioTurnoEntity;
    }
    
    horasExtra.usuario = usuario;
    
    // Asignar tipo de hora extra
    if (segmento.tipoHoraExtra) {
      horasExtra.tipoHoraExtra = segmento.tipoHoraExtra;
      horasExtra.tipoHoraExtraId = segmento.tipoHoraExtra.id;
      horasExtra.cantidadHoras = segmento.cantidadHoras;
    } else {
      horasExtra.tipoHoraExtra = null;
      horasExtra.tipoHoraExtraId = null;
      horasExtra.cantidadHoras = 0;
    }

    console.log('>>> [procesarDiaCompleto] Creando registro:', {
      fecha: fechaString,
      tipo: segmento.tipoHoraExtra?.descripcion || 'SIN TIPO ASIGNADO',
      inicio: inicioTimeFormatted,
      fin: finTimeFormatted,
      horas: horasExtra.cantidadHoras,
      tipoId: horasExtra.tipoHoraExtraId || 'NULL',
      usuarioTurnoId: usuarioTurnoId
    });

    const horaExtraGuardada = await this.horasExtraRepository.save(horasExtra);
    horasExtrasCreadas.push(horaExtraGuardada);
  }

  return horasExtrasCreadas;
}

/**
 * ✅ NUEVO MÉTODO: Obtiene la fecha del día siguiente en formato YYYY-MM-DD
 */
private obtenerFechaSiguiente(fechaString: string): string {
  const fecha = new Date(fechaString + 'T12:00:00'); // Usar mediodía para evitar problemas
  fecha.setDate(fecha.getDate() + 1);
  
  const año = fecha.getFullYear();
  const mes = String(fecha.getMonth() + 1).padStart(2, '0');
  const dia = String(fecha.getDate()).padStart(2, '0');
  
  return `${año}-${mes}-${dia}`;
}

  /**
   * ✅ NUEVO MÉTODO: Busca el usuarioTurno activo para una fecha específica
   */
  private async buscarUsuarioTurnoPorFecha(userId: number, fechaRegistro: Date): Promise<{usuarioTurnoEntity: UsuarioTurno | null, usuarioTurnoId: number}> {
    console.log('>>> [buscarUsuarioTurnoPorFecha] Buscando turno para:', {
      userId: userId,
      fecha: fechaRegistro.toISOString().split('T')[0]
    });

    try {
      // Buscar todos los turnos del usuario
      const usuariosTurnos = await this.usuarioTurnoRepository.find({
        where: { usuarioFK: userId },
        relations: ['userTurno', 'turno'],
        order: { fechaInicio: 'DESC' } // Más recientes primero
      });

      console.log('>>> [buscarUsuarioTurnoPorFecha] Turnos encontrados para el usuario:', usuariosTurnos.length);

      if (usuariosTurnos.length === 0) {
        console.log('>>> [buscarUsuarioTurnoPorFecha] No se encontraron turnos para el usuario');
        return { usuarioTurnoEntity: null, usuarioTurnoId: 0 };
      }

      // Buscar el turno que contenga la fecha de registro
      for (const usuarioTurno of usuariosTurnos) {
        const fechaInicio = new Date(usuarioTurno.fechaInicio);
        const fechaFin = new Date(usuarioTurno.fechaFin);
        
        // Normalizar las fechas para comparar solo el día (sin hora)
        fechaInicio.setHours(0, 0, 0, 0);
        fechaFin.setHours(23, 59, 59, 999); // Incluir todo el día
        const fechaRegistroNormalizada = new Date(fechaRegistro);
        fechaRegistroNormalizada.setHours(12, 0, 0, 0); // Medio día para evitar problemas de zona horaria

        console.log('>>> [buscarUsuarioTurnoPorFecha] Comparando fechas:', {
          turnoId: usuarioTurno.idUsuarioTurno,
          fechaInicio: fechaInicio.toISOString().split('T')[0],
          fechaFin: fechaFin.toISOString().split('T')[0],
          fechaRegistro: fechaRegistroNormalizada.toISOString().split('T')[0],
          dentroDelRango: fechaRegistroNormalizada >= fechaInicio && fechaRegistroNormalizada <= fechaFin
        });

        // Verificar si la fecha de registro está dentro del rango
        if (fechaRegistroNormalizada >= fechaInicio && fechaRegistroNormalizada <= fechaFin) {
          console.log('>>> [buscarUsuarioTurnoPorFecha] ✅ Turno encontrado:', {
            idUsuarioTurno: usuarioTurno.idUsuarioTurno,
            fechaInicio: fechaInicio.toISOString().split('T')[0],
            fechaFin: fechaFin.toISOString().split('T')[0]
          });
          
          return { 
            usuarioTurnoEntity: usuarioTurno, 
            usuarioTurnoId: usuarioTurno.idUsuarioTurno 
          };
        }
      }

      console.log('>>> [buscarUsuarioTurnoPorFecha] ⚠️ No se encontró turno activo para la fecha');
      return { usuarioTurnoEntity: null, usuarioTurnoId: 0 };

    } catch (error) {
      console.error('>>> [buscarUsuarioTurnoPorFecha] Error al buscar usuario turno:', error);
      return { usuarioTurnoEntity: null, usuarioTurnoId: 0 };
    }
  }

  /**
   * MÉTODO COMPLETAMENTE NUEVO: Divide el rango asegurando que TODAS las horas sean procesadas
   */
  private async dividirPorTiposDeHoraCompleto(horaInicio: Date, horaFin: Date): Promise<SegmentoHora[]> {
    console.log('>>> [dividirPorTiposDeHoraCompleto] Iniciando división completa:', {
      inicio: horaInicio.toISOString(),
      fin: horaFin.toISOString()
    });

    // Obtener todos los tipos de horas extra
    const tiposHorasExtra = await this.tipoHorasExtraRepository.find({
      order: { id: 'ASC' }
    });
    
    console.log('>>> [dividirPorTiposDeHoraCompleto] Tipos disponibles:', tiposHorasExtra.length);

    // Crear lista de todos los puntos de tiempo críticos
    const puntosDeControl = this.crearPuntosDeControl(tiposHorasExtra, horaInicio, horaFin);
    
    console.log('>>> [dividirPorTiposDeHoraCompleto] Puntos de control:', puntosDeControl.length);

    // Crear segmentos para cada intervalo entre puntos de control
    const segmentos: SegmentoHora[] = [];
    
    for (let i = 0; i < puntosDeControl.length - 1; i++) {
      const puntoActual = puntosDeControl[i];
      const siguientePunto = puntosDeControl[i + 1];
      
      const duracionMs = siguientePunto.tiempo.getTime() - puntoActual.tiempo.getTime();
      
      if (duracionMs > 0) {
        // Encontrar el tipo prioritario activo en este intervalo
        const tipoActivo = this.encontrarTipoPrioritario(puntoActual.tiempo, tiposHorasExtra);
        
        const segmento: SegmentoHora = {
          horaInicio: new Date(puntoActual.tiempo),
          horaFin: new Date(siguientePunto.tiempo),
          cantidadHoras: this.calcularCantidadHoras(duracionMs),
          tipoHoraExtra: tipoActivo
        };
        
        console.log('>>> Segmento creado:', {
          tipo: tipoActivo?.descripcion || 'SIN TIPO',
          inicio: segmento.horaInicio.toLocaleTimeString(),
          fin: segmento.horaFin.toLocaleTimeString(),
          horas: segmento.cantidadHoras
        });
        
        segmentos.push(segmento);
      }
    }

    // Agrupar segmentos consecutivos del mismo tipo
    const segmentosAgrupados = this.agruparSegmentosConsecutivos(segmentos);
    
    console.log('>>> Segmentos finales agrupados:', segmentosAgrupados.map(s => ({
      tipo: s.tipoHoraExtra?.descripcion || 'SIN TIPO',
      inicio: s.horaInicio.toLocaleTimeString(),
      fin: s.horaFin.toLocaleTimeString(),
      horas: s.cantidadHoras
    })));

    return segmentosAgrupados;
  }

  /**
   * NUEVO: Crea puntos de control donde pueden cambiar los tipos activos
   */
  private crearPuntosDeControl(tiposHorasExtra: TipoHorasExtra[], horaInicio: Date, horaFin: Date): PuntoTiempo[] {
    const puntosSet = new Set<number>();
    
    // Agregar inicio y fin del rango principal
    puntosSet.add(horaInicio.getTime());
    puntosSet.add(horaFin.getTime());
    
    // Obtener fecha base para crear las horas
    const fechaBase = new Date(horaInicio);
    fechaBase.setHours(0, 0, 0, 0);
    
    // Agregar puntos de inicio y fin de cada rango de tipo
    for (const tipo of tiposHorasExtra) {
      // Rango 1
      if (tipo.horaInicio && tipo.horaFin) {
        this.agregarPuntosDeRango(tipo.horaInicio, tipo.horaFin, fechaBase, horaInicio, horaFin, puntosSet);
      }
      
      // Rango 2
      if (tipo.horaInicio2 && tipo.horaFin2) {
        this.agregarPuntosDeRango(tipo.horaInicio2, tipo.horaFin2, fechaBase, horaInicio, horaFin, puntosSet);
      }
    }
    
    // Convertir a array ordenado y crear objetos PuntoTiempo
    const tiemposOrdenados = Array.from(puntosSet).sort((a, b) => a - b);
    
    return tiemposOrdenados.map(tiempo => ({
      tiempo: new Date(tiempo),
      tiposActivos: new Set<number>()
    }));
  }

  /**
   * NUEVO: Agrega puntos de un rango específico considerando rangos que cruzan medianoche
   */
  private agregarPuntosDeRango(
    horaInicio: string, 
    horaFin: string, 
    fechaBase: Date, 
    rangoInicio: Date, 
    rangoFin: Date, 
    puntosSet: Set<number>
  ): void {
    const [inicioH, inicioM] = horaInicio.split(':').map(Number);
    const [finH, finM] = horaFin.split(':').map(Number);
    
    // Crear fechas para el día base
    let inicioRango = new Date(fechaBase);
    inicioRango.setHours(inicioH, inicioM, 0, 0);
    
    let finRango = new Date(fechaBase);
    finRango.setHours(finH, finM, 0, 0);
    
    // Si cruza medianoche
    if (finRango <= inicioRango) {
      finRango.setDate(finRango.getDate() + 1);
    }
    
    // Evaluar tanto el día actual como el siguiente
    const rangosParaEvaluar = [
      { inicio: inicioRango, fin: finRango },
      { 
        inicio: new Date(inicioRango.getTime() + 24 * 60 * 60 * 1000), 
        fin: new Date(finRango.getTime() + 24 * 60 * 60 * 1000) 
      }
    ];
    
    for (const rango of rangosParaEvaluar) {
      // Solo agregar si intersecta con nuestro rango de interés
      if (rango.inicio < rangoFin && rango.fin > rangoInicio) {
        // Agregar inicio si está dentro del rango
        if (rango.inicio >= rangoInicio && rango.inicio <= rangoFin) {
          puntosSet.add(rango.inicio.getTime());
        }
        
        // Agregar fin si está dentro del rango
        if (rango.fin >= rangoInicio && rango.fin <= rangoFin) {
          puntosSet.add(rango.fin.getTime());
        }
      }
    }
  }

  /**
   * NUEVO: Encuentra el tipo prioritario que aplica en un momento específico
   */
  private encontrarTipoPrioritario(momento: Date, tiposHorasExtra: TipoHorasExtra[]): TipoHorasExtra | null {
    // Buscar el primer tipo que contenga este momento (por orden de prioridad/ID)
    for (const tipo of tiposHorasExtra) {
      if (this.momentoEstaDentroDelTipo(momento, tipo)) {
        return tipo;
      }
    }
    
    return null; // ⚠️ IMPORTANTE: Retorna null si no hay tipo que aplique
  }

  /**
   * NUEVO: Verifica si un momento está dentro de los rangos de un tipo
   */
  private momentoEstaDentroDelTipo(momento: Date, tipo: TipoHorasExtra): boolean {
    // Verificar rango 1
    if (tipo.horaInicio && tipo.horaFin) {
      if (this.momentoEstaDentroDelRango(momento, tipo.horaInicio, tipo.horaFin)) {
        return true;
      }
    }
    
    // Verificar rango 2
    if (tipo.horaInicio2 && tipo.horaFin2) {
      if (this.momentoEstaDentroDelRango(momento, tipo.horaInicio2, tipo.horaFin2)) {
        return true;
      }
    }
    
    return false;
  }

  /**
   * NUEVO: Verifica si un momento está dentro de un rango específico
   */
  private momentoEstaDentroDelRango(momento: Date, horaInicio: string, horaFin: string): boolean {
    const [inicioH, inicioM] = horaInicio.split(':').map(Number);
    const [finH, finM] = horaFin.split(':').map(Number);
    
    const horaActual = momento.getHours();
    const minutoActual = momento.getMinutes();
    
    const minutosDelDia = horaActual * 60 + minutoActual;
    const inicioMinutos = inicioH * 60 + inicioM;
    const finMinutos = finH * 60 + finM;
    
    if (inicioMinutos <= finMinutos) {
      // Rango normal (no cruza medianoche)
      return minutosDelDia >= inicioMinutos && minutosDelDia < finMinutos;
    } else {
      // Rango que cruza medianoche
      return minutosDelDia >= inicioMinutos || minutosDelDia < finMinutos;
    }
  }

  /**
   * Valida que el formato de hora sea HH:mm
   */
  private validarFormatoHora(hora: string): boolean {
    const regex = /^([0-1]\d|2[0-3]):([0-5]\d)$/;
    return regex.test(hora);
  }

  /**
   * Procesa la fecha de entrada y la convierte a formato YYYY-MM-DD
   */
  private procesarFecha(fecha: Date | string): string {
    if (typeof fecha === 'string') {
      return fecha.split('T')[0];
    } else {
      const d = fecha;
      return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    }
  }

  /**
   * Calcula la cantidad de horas con precisión decimal
   */
  private calcularCantidadHoras(diffMs: number): number {
    const horas = diffMs / (1000 * 60 * 60);
    return Math.round(horas * 100) / 100; // Redondear a 2 decimales
  }

  /**
   * Crea una fecha completa combinando fecha base con hora en formato HH:mm
   */
  private crearFechaConHora(fechaBase: Date, hora: string): Date {
    const [horas, minutos] = hora.split(':').map(Number);
    const fecha = new Date(fechaBase);
    fecha.setHours(horas, minutos, 0, 0);
    return fecha;
  }

  /**
   * Formatea una fecha para guardar SOLO LA HORA en formato HH:MM:SS
   */
  private formatearSoloHora(fecha: Date): string {
    const hours = String(fecha.getHours()).padStart(2, '0');
    const minutes = String(fecha.getMinutes()).padStart(2, '0');
    const seconds = String(fecha.getSeconds()).padStart(2, '0');
    
    return `${hours}:${minutes}:${seconds}`;
  }

  /**
   * Agrupa segmentos consecutivos del mismo tipo
   */
  private agruparSegmentosConsecutivos(segmentos: SegmentoHora[]): SegmentoHora[] {
    if (segmentos.length === 0) return segmentos;
    
    const segmentosAgrupados: SegmentoHora[] = [];
    let segmentoActual = { ...segmentos[0] };
    
    for (let i = 1; i < segmentos.length; i++) {
      const siguienteSegmento = segmentos[i];
      
      // Si es del mismo tipo (incluyendo null) y son consecutivos, agrupar
      if (segmentoActual.tipoHoraExtra?.id === siguienteSegmento.tipoHoraExtra?.id &&
          Math.abs(segmentoActual.horaFin.getTime() - siguienteSegmento.horaInicio.getTime()) < 60000) { // Tolerancia de 1 minuto
        
        segmentoActual.horaFin = new Date(siguienteSegmento.horaFin);
        segmentoActual.cantidadHoras += siguienteSegmento.cantidadHoras;
        segmentoActual.cantidadHoras = Math.round(segmentoActual.cantidadHoras * 100) / 100; // Redondear
      } else {
        segmentosAgrupados.push(segmentoActual);
        segmentoActual = { ...siguienteSegmento };
      }
    }
    
    segmentosAgrupados.push(segmentoActual);
    return segmentosAgrupados;
  }

  /*
  async findAll(): Promise<HorasExtra[]> {
    return this.horasExtraRepository.find({
      relations: ['tipoHoraExtra', 'usuario', 'usuarioTurno'],
      order: { fechaCreacion: 'DESC' }
    });
  }
*/
// Con este nuevo método que filtra por usuario

/*
  async findOne(id: number): Promise<HorasExtra> {
    const horaExtra = await this.horasExtraRepository.findOne({
      where: { idHoraExtra: id },
      relations: ['tipoHoraExtra', 'usuario', 'usuarioTurno', 'usuarioTurno.turno'] // Cambiado de 'Turno' a 'turno'
    });
    if (!horaExtra) {
      throw new NotFoundException(`Hora extra with ID ${id} not found`);
    }
    return horaExtra;
  }

  async remove(id: number): Promise<void> {
    const horaExtra = await this.findOne(id);
    await this.horasExtraRepository.remove(horaExtra);
  }
    */
/**
 */
/**
 * ✅ NUEVO MÉTODO: Actualización individual de hora extra
 * Actualiza solo el registro especificado sin afectar otros registros
 */
async updateIndividual(id: number, updateHorasExtraDto: UpdateHorasExtraDto): Promise<HorasExtra> {
  console.log('>>> [HorasExtraService.updateIndividual] Iniciando actualización:', { id, data: updateHorasExtraDto });

  // 1. Obtener registro existente
  const horaExtraExistente = await this.findOne(id);
  if (!horaExtraExistente) {
    throw new NotFoundException(`Hora extra con ID ${id} no encontrada`);
  }

  // 2. Validar nuevos horarios si se proporcionan
  const horaInicioFinal = updateHorasExtraDto.horaInicio || horaExtraExistente.horaInicio.substring(0, 5);
  const horaFinFinal = updateHorasExtraDto.horaFin || horaExtraExistente.horaFin.substring(0, 5);
  const fechaFinal = updateHorasExtraDto.fecha || horaExtraExistente.fecha;

  // 3. Crear objetos Date para el análisis
  const fechaBase = new Date(this.procesarFecha(fechaFinal) + 'T00:00:00');
  const horaInicioObj = this.crearFechaConHora(fechaBase, horaInicioFinal);
  let horaFinObj = this.crearFechaConHora(fechaBase, horaFinFinal);

  // 4. Detectar si cruza medianoche
  const cruzaMedianoche = horaFinObj.getTime() <= horaInicioObj.getTime();
  if (cruzaMedianoche) {
    horaFinObj.setDate(horaFinObj.getDate() + 1);
  }

    // 6. Validar duración mínima
  const duracionMs = horaFinObj.getTime() - horaInicioObj.getTime();
  if (duracionMs < 60000) { // Menos de 1 minuto
    throw new BadRequestException('La duración mínima debe ser de 1 minuto');
  }

  // 7. ✅ NUEVA VALIDACIÓN: Verificar solapamiento con horario laboral
  await this.validarSolapamientoConTurno(
    horaInicioObj,
    horaFinObj,
    fechaBase,
    horaExtraExistente.usuarioE
  );

  console.log('>>> Análisis de horarios:', {
    cruzaMedianoche,
    inicio: horaInicioObj.toISOString(),
    fin: horaFinObj.toISOString()
  });


  // 5. Si cruza medianoche, dividir en dos registros
  if (cruzaMedianoche) {
    // Eliminar registro original
    await this.horasExtraRepository.remove(horaExtraExistente);

    // Crear DTO para el proceso de creación
    const createDto: CreateHorasExtraDto = {
      fecha: fechaFinal,
      ticket: updateHorasExtraDto.ticket || horaExtraExistente.ticket,
      horaInicio: horaInicioFinal,
      horaFin: horaFinFinal,
      estado: horaExtraExistente.estado
    };

    // Usar el método create que ya maneja la división por días
    const nuevosRegistros = await this.create(createDto, horaExtraExistente.usuarioE);
    
    console.log('>>> Registros creados después de cruce de medianoche:', 
      nuevosRegistros.map(r => ({
        id: r.idHoraExtra,
        fecha: r.fecha,
        horario: `${r.horaInicio} - ${r.horaFin}`
      }))
    );

    // Retornar el primer registro del nuevo grupo
    return nuevosRegistros[0];
  }

  // 6. Si no cruza medianoche, actualización normal
  const resultado = await this.recalcularTipoYCantidad(horaExtraExistente, updateHorasExtraDto);
  
  const datosActualizacion: Partial<HorasExtra> = {
    fecha: this.procesarFecha(fechaFinal) as any,
    horaInicio: horaInicioFinal + ':00',
    horaFin: horaFinFinal + ':00',
    ticket: updateHorasExtraDto.ticket || horaExtraExistente.ticket,
    fechaActualizacion: new Date(),
    tipoHoraExtra: resultado.tipoHoraExtra,
    tipoHoraExtraId: resultado.tipoHoraExtra?.id || null,
    cantidadHoras: resultado.cantidadHoras
  };

  await this.horasExtraRepository.update(id, datosActualizacion);
  return this.findOne(id);
}

/**
 * ✅ MÉTODO AUXILIAR: Recalcula tipo de hora extra y cantidad para un registro individual
 */
private async recalcularTipoYCantidad(
  horaExtraExistente: HorasExtra,
  updateDto: UpdateHorasExtraDto
): Promise<{ tipoHoraExtra: TipoHorasExtra | null; cantidadHoras: number }> {
  
  // Obtener horarios finales (los nuevos o los existentes)
  const horaInicioFinal = updateDto.horaInicio || horaExtraExistente.horaInicio.substring(0, 5);
  const horaFinFinal = updateDto.horaFin || horaExtraExistente.horaFin.substring(0, 5);
  const fechaFinal = updateDto.fecha || horaExtraExistente.fecha;

  console.log('>>> [recalcularTipoYCantidad] Recalculando con:', {
    fecha: fechaFinal,
    inicio: horaInicioFinal,
    fin: horaFinFinal
  });

  // Crear objetos Date para el cálculo
  const fechaString = this.procesarFecha(fechaFinal);
  const fechaBase = new Date(fechaString + 'T00:00:00');
  
  const horaInicioObj = this.crearFechaConHora(fechaBase, horaInicioFinal);
  let horaFinObj = this.crearFechaConHora(fechaBase, horaFinFinal);

  // Manejar cruce de medianoche
  if (horaFinObj.getTime() <= horaInicioObj.getTime()) {
    horaFinObj.setDate(horaFinObj.getDate() + 1);
  }

  // Validar duración mínima
  const duracionMs = horaFinObj.getTime() - horaInicioObj.getTime();
  if (duracionMs < 60000) { // Menos de 1 minuto
    throw new BadRequestException('La duración mínima debe ser de 1 minuto');
  }

  // Encontrar el tipo de hora extra que aplica
  const tiposHorasExtra = await this.tipoHorasExtraRepository.find({
    order: { id: 'ASC' }
  });

  // Para simplificar, usar el punto medio del rango para determinar el tipo
  const puntoMedio = new Date((horaInicioObj.getTime() + horaFinObj.getTime()) / 2);
  const tipoEncontrado = this.encontrarTipoPrioritario(puntoMedio, tiposHorasExtra);

  // Calcular cantidad de horas
  const cantidadHoras = this.calcularCantidadHoras(duracionMs);

  console.log('>>> [recalcularTipoYCantidad] Resultado:', {
    tipo: tipoEncontrado?.descripcion || 'SIN TIPO',
    horas: cantidadHoras,
    duracionMinutos: duracionMs / (1000 * 60)
  });

  return {
    tipoHoraExtra: tipoEncontrado,
    cantidadHoras: cantidadHoras
  };
}

/**
 * ✅ MÉTODO SIMPLIFICADO: Validación básica de horarios para actualización individual
 */
private validarHorariosIndividual(horaInicio: string, horaFin: string, fecha: Date | string): void {
  // Validar formato
  if (!this.validarFormatoHora(horaInicio) || !this.validarFormatoHora(horaFin)) {
    throw new BadRequestException('Las horas deben estar en formato HH:mm');
  }

  // Crear objetos Date para validar
  const fechaString = this.procesarFecha(fecha);
  const fechaBase = new Date(fechaString + 'T00:00:00');
  
  const horaInicioObj = this.crearFechaConHora(fechaBase, horaInicio);
  let horaFinObj = this.crearFechaConHora(fechaBase, horaFin);

  // Ajustar si cruza medianoche
  if (horaFinObj.getTime() <= horaInicioObj.getTime()) {
    horaFinObj.setDate(horaFinObj.getDate() + 1);
  }

  // Validar duración
  const duracionMs = horaFinObj.getTime() - horaInicioObj.getTime();
  if (duracionMs < 60000) {
    throw new BadRequestException('La duración mínima debe ser de 1 minuto');
  }

  // Validar que no exceda 24 horas
  if (duracionMs > 24 * 60 * 60 * 1000) {
    throw new BadRequestException('La duración no puede exceder 24 horas');
  }
}
/**
 * ✅ NUEVO MÉTODO: Encontrar registros relacionados incluyendo días cruzados
 */

async updateEstado(id: number, nuevoEstado: EstadoHoraExtra, userId: number): Promise<HorasExtra> {
 
    // Validación adicional
    if (!Object.values(EstadoHoraExtra).includes(nuevoEstado)) {
        throw new BadRequestException(
            `Estado inválido. Debe ser uno de: ${Object.values(EstadoHoraExtra).join(', ')}`
        );
    }

    // 1. Buscar la hora extra
    const horaExtra = await this.findOne(id);
    if (!horaExtra) {
      throw new NotFoundException(`Hora extra con ID ${id} no encontrada`);
    }

    // 2. Verificar permisos si es necesario
    // Aquí puedes agregar lógica de permisos según roles

    // 3. Actualizar el estado
    horaExtra.estado = nuevoEstado;
    horaExtra.fechaActualizacion = new Date();

    // 4. Guardar los cambios
    const horaExtraActualizada = await this.horasExtraRepository.save(horaExtra);
    return horaExtraActualizada;
  }

  private async validarSolapamientoConTurno(
  horaInicio: Date,
  horaFin: Date,
  fechaRegistro: Date,
  userId: number
): Promise<void> {
  console.log('>>> [validarSolapamientoConTurno] Iniciando validación:', {
    usuario: userId,
    fecha: fechaRegistro.toISOString().split('T')[0],
    horaInicio: horaInicio.toLocaleTimeString(),
    horaFin: horaFin.toLocaleTimeString()
  });

  // 1. Buscar el turno asignado para esta fecha
  const { usuarioTurnoEntity } = await this.buscarUsuarioTurnoPorFecha(userId, fechaRegistro);
  
  if (!usuarioTurnoEntity || !usuarioTurnoEntity.turno) {
    console.log('>>> [validarSolapamientoConTurno] No hay turno asignado - Permitiendo registro');
    return; // Si no hay turno asignado, permitir el registro
  }

  const turno = usuarioTurnoEntity.turno;
  console.log('>>> [validarSolapamientoConTurno] Turno encontrado:', {
    turnoId: turno.idTurno,
    nombre: turno.nombre,
    horaInicio: turno.horaInicio,
    horaFin: turno.horaFin
  });

  // 2. Crear objetos Date para el horario del turno en la misma fecha base
  const fechaBase = new Date(horaInicio);
  fechaBase.setHours(0, 0, 0, 0);
  
  const horaInicioStr = typeof turno.horaInicio === 'string' ? turno.horaInicio : turno.horaInicio.toLocaleTimeString('en-US', { hour12: false }).substring(0, 5);
  const horaFinStr = typeof turno.horaFin === 'string' ? turno.horaFin : turno.horaFin.toLocaleTimeString('en-US', { hour12: false }).substring(0, 5);
  
  const turnoInicio = this.crearFechaConHora(fechaBase, horaInicioStr);
  let turnoFin = this.crearFechaConHora(fechaBase, horaFinStr);
  
  // 3. Verificar si el turno cruza medianoche
  const turnoCruzaMedianoche = turnoFin.getTime() <= turnoInicio.getTime();
  if (turnoCruzaMedianoche) {
    turnoFin.setDate(turnoFin.getDate() + 1);
  }

  console.log('>>> [validarSolapamientoConTurno] Horario del turno:', {
    inicio: turnoInicio.toISOString(),
    fin: turnoFin.toISOString(),
    cruzaMedianoche: turnoCruzaMedianoche
  });

  // 4. Verificar solapamiento
  const haySolapamiento = this.verificarSolapamientoHorarios(
    horaInicio, horaFin,
    turnoInicio, turnoFin
  );

  if (haySolapamiento) {
    const mensajeError = `No puedes registrar una hora extra en tu horario laboral. `;// +
     // `Tu turno es de ${turno.horaInicio} a ${turno.horaFin}`;

    console.log('>>> [validarSolapamientoConTurno] ❌ SOLAPAMIENTO DETECTADO:', mensajeError);
    throw new BadRequestException(mensajeError);
  }

  console.log('>>> [validarSolapamientoConTurno] ✅ No hay solapamiento - Registro permitido');
}

private verificarSolapamientoHorarios(
  inicio1: Date, fin1: Date,
  inicio2: Date, fin2: Date
): boolean {
  // Dos rangos se solapan si:
  // - El inicio del rango 1 está antes del fin del rango 2 Y
  // - El fin del rango 1 está después del inicio del rango 2
  const solapan = inicio1 < fin2 && fin1 > inicio2;
  
  console.log('>>> [verificarSolapamientoHorarios] Verificación de solapamiento:', {
    rango1: `${inicio1.toLocaleTimeString()} - ${fin1.toLocaleTimeString()}`,
    rango2: `${inicio2.toLocaleTimeString()} - ${fin2.toLocaleTimeString()}`,
    solapan: solapan
  });
  
  return solapan;
}

  // Obtener solo las horas extras del usuario autenticado
 
  // Obtener solo las horas extras del usuario autenticado

// Agregar método específico para obtener solo las horas del usuario autenticado
async findByUser(userId: number): Promise<HorasExtra[]> {
  console.log('>>> [HorasExtraService.findByUser] Buscando horas extras para usuario:', userId);
  
  return this.horasExtraRepository.find({
    where: { usuarioE: userId },
    relations: ['tipoHoraExtra', 'usuario', 'usuarioTurno'],
    order: { fechaCreacion: 'DESC' }
  });
}

// Modificar el método findOne para validar permisos
async findOne(id: number, userId?: number): Promise<HorasExtra> {
  const whereCondition: any = { idHoraExtra: id };
  
  // Si se proporciona userId, validar que solo pueda ver sus propias horas
  if (userId) {
    whereCondition.usuarioE = userId;
  }

  const horaExtra = await this.horasExtraRepository.findOne({
    where: whereCondition,
    relations: ['tipoHoraExtra', 'usuario', 'usuarioTurno', 'usuarioTurno.turno']
  });
  
  if (!horaExtra) {
    if (userId) {
      throw new NotFoundException(`Hora extra with ID ${id} not found or you don't have permission to access it`);
    } else {
      throw new NotFoundException(`Hora extra with ID ${id} not found`);
    }
  }
  
  return horaExtra;
}

// ✅ Agregar este método al HorasExtraService

async remove(id: number, userId?: number): Promise<void> {
  console.log('>>> [HorasExtraService.remove] Eliminando hora extra:', { id, userId });
  
  // Si se proporciona userId, validar que solo pueda eliminar sus propias horas
  const horaExtra = await this.findOne(id, userId);
  
  if (!horaExtra) {
    throw new NotFoundException(`Hora extra with ID ${id} not found`);
  }
  
  // Validación adicional si se proporciona userId
  if (userId && horaExtra.usuarioE !== userId) {
    throw new ForbiddenException('No tienes permisos para eliminar esta hora extra');
  }
  
  await this.horasExtraRepository.remove(horaExtra);
  console.log('>>> [HorasExtraService.remove] Hora extra eliminada exitosamente');
}

// ✅ NUEVO MÉTODO: Buscar horas extras con filtros obligatorios
// ✅ MÉTODO CORREGIDO: Buscar horas extras con filtros obligatorios
async findByUserWithFilters(userId: number, filtros: FiltrosHorasExtraDto): Promise<HorasExtra[]> {
  console.log('>>> [DEBUG] Iniciando búsqueda con filtros:', {
    userId,
    fechaDesde: filtros.fechaDesde,
    fechaHasta: filtros.fechaHasta,
    estados: filtros.estados || 'sin filtro de estados'
  });

  try {
    const queryBuilder = this.horasExtraRepository
      .createQueryBuilder('horasExtra')
      .leftJoinAndSelect('horasExtra.tipoHoraExtra', 'tipoHoraExtra')
      .leftJoinAndSelect('horasExtra.usuario', 'usuario')
      .leftJoinAndSelect('horasExtra.usuarioTurno', 'usuarioTurno')
      .leftJoinAndSelect('usuarioTurno.turno', 'turno')
      .where('horasExtra.usuarioE = :userId', { userId });

    if (filtros.fechaDesde && filtros.fechaHasta) {
      queryBuilder.andWhere('horasExtra.fecha BETWEEN :fechaDesde AND :fechaHasta', {
        fechaDesde: filtros.fechaDesde,
        fechaHasta: filtros.fechaHasta
      });
    }

    if (filtros.estados && filtros.estados.length > 0) {
      queryBuilder.andWhere('horasExtra.estado IN (:...estados)', {
        estados: filtros.estados
      });
    }

    return await queryBuilder.getMany();
  } catch (error) {
    console.error('Error en findByUserWithFilters:', error);
    throw error;
  }
}

// También actualizar el método findAll para incluir las mismas relaciones
async findAll(userId?: number): Promise<HorasExtra[]> {
  const whereCondition = userId ? { usuarioE: userId } : {};
  
  return this.horasExtraRepository.find({
    where: whereCondition,
    relations: [
      'tipoHoraExtra',
      'usuario',
      'usuarioTurno',
      'usuarioTurno.turno'
    ],
    order: { fechaCreacion: 'DESC' }
  });

}
}
