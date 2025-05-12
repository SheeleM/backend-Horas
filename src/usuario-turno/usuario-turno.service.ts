import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { CreateUsuarioTurnoDto } from './dto/create-usuario-turno.dto';
import { UpdateUsuarioTurnoDto } from './dto/update-usuario-turno.dto';
import { UsuarioTurno } from './entities/usuario-turno.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, LessThanOrEqual, MoreThanOrEqual, Repository } from 'typeorm';
import { GetUsuarioTurnoDto } from './dto/get-usuario-Turno.dto';
import { Turno } from 'src/turno/entities/turno.entity';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class UsuarioTurnoService {
  constructor(
    @InjectRepository(UsuarioTurno)
    private usuarioTurnoRepository: Repository<UsuarioTurno>,
    @InjectRepository(Turno)
    private turnoRepository: Repository<Turno>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {
    console.log('>>> Repositorio inyectado correctamente');
  }

  // Mapa para convertir nombres de días a números (0 = domingo, 1 = lunes, etc.)
  private readonly diasSemana = {
    'domingo': 0,
    'lunes': 1,
    'martes': 2,
    'miercoles': 3,
    'jueves': 4,
    'viernes': 5,
    'sabado': 6,
  };

  async create(createUsuarioTurnoDto: CreateUsuarioTurnoDto): Promise<UsuarioTurno[] | UsuarioTurno> {
    // Verificar si existen el usuario y el turno
    const [usuario, turno] = await Promise.all([
      this.userRepository.findOne({ where: { id: createUsuarioTurnoDto.usuarioFK } }),
      this.turnoRepository.findOne({ where: { idTurno: createUsuarioTurnoDto.turnoFK } })
    ]);

    if (!usuario) {
      throw new NotFoundException(`Usuario con ID ${createUsuarioTurnoDto.usuarioFK} no encontrado`);
    }

    if (!turno) {
      throw new NotFoundException(`Turno con ID ${createUsuarioTurnoDto.turnoFK} no encontrado`);
    }

    // Verificar si el turno tiene configuración de días específicos
    if (!turno.diaInicio || !turno.diaFin) {
      // Si no tiene configuración de días, usar el método original
      return this.createSingleAssignment(createUsuarioTurnoDto);
    }

    // Convertir nombres de días a números (0-6)
    const diaInicio = this.diasSemana[turno.diaInicio.toLowerCase()];
    const diaFin = this.diasSemana[turno.diaFin.toLowerCase()];

    if (diaInicio === undefined || diaFin === undefined) {
      throw new Error('Configuración de días en el turno no es válida');
    }

    // Calcular los días de la semana incluidos en este turno
    const diasTurno: number[] = [];
    if (diaInicio <= diaFin) {
      // Caso simple: lunes a viernes (1-5)
      for (let i = diaInicio; i <= diaFin; i++) {
        diasTurno.push(i);
      }
    } else {
      // Caso complejo: domingo a martes (0,1,2) o viernes a lunes (5,6,0,1)
      for (let i = diaInicio; i <= 6; i++) {
        diasTurno.push(i);
      }
      for (let i = 0; i <= diaFin; i++) {
        diasTurno.push(i);
      }
    }

    // Obtener fechas de inicio y fin
    const fechaInicio = new Date(createUsuarioTurnoDto.fechaInicio);
    const fechaFin = new Date(createUsuarioTurnoDto.fechaFin);
    
    // Array para almacenar las asignaciones de turno
    const asignacionesTurno: UsuarioTurno[] = [];
    
    // Crear un array de bloques de días consecutivos según la configuración del turno
    const bloques = this.crearBloquesConsecutivos(fechaInicio, fechaFin, diasTurno);
    
    // Crear una asignación para cada bloque de días consecutivos
    for (const bloque of bloques) {
      const usuarioTurno = new UsuarioTurno();
      usuarioTurno.turnoFK = createUsuarioTurnoDto.turnoFK;
      usuarioTurno.usuarioFK = createUsuarioTurnoDto.usuarioFK;
      usuarioTurno.fechaInicio = bloque.inicio;
      usuarioTurno.fechaFin = bloque.fin;
      usuarioTurno.creado = new Date();
      usuarioTurno.actualizado = new Date();
      
      asignacionesTurno.push(usuarioTurno);
    }
    
    // Guardar todas las asignaciones creadas
    if (asignacionesTurno.length > 0) {
      return this.usuarioTurnoRepository.save(asignacionesTurno);
    }
    
    const nombresDias = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
    const diasPermitidos = diasTurno.map(dia => nombresDias[dia]).join(', ');
    throw new BadRequestException(
      `No se pueden crear asignaciones porque las fechas seleccionadas no coinciden con los días configurados para este turno. ` +
      `Los días permitidos son: ${diasPermitidos}`
    );
  }

  // Método para crear bloques de días consecutivos
  private crearBloquesConsecutivos(
    fechaInicio: Date, 
    fechaFin: Date, 
    diasValidos: number[]
  ): { inicio: Date, fin: Date }[] {
    const bloques: { inicio: Date, fin: Date }[] = [];
    let inicioBloque: Date | null = null;
    let finBloque: Date | null = null;
    
    // Clonar la fecha inicial para no modificar la original
    const currentDate = new Date(fechaInicio);
    
    // Iterar por cada día en el rango
    while (currentDate <= fechaFin) {
      const diaSemana = currentDate.getDay(); // 0 (domingo) a 6 (sábado)
      
      if (diasValidos.includes(diaSemana)) {
        // Este día está en los días válidos del turno
        if (inicioBloque === null) {
          // Inicio de un nuevo bloque
          inicioBloque = new Date(currentDate);
        }
        // Actualizar el fin del bloque actual
        finBloque = new Date(currentDate);
      } else if (inicioBloque !== null && finBloque !== null) {
        // Este día no es válido y tenemos un bloque en progreso, por lo que lo finalizamos
        bloques.push({ inicio: inicioBloque, fin: finBloque });
        inicioBloque = null;
        finBloque = null;
      }
      
      // Avanzar al siguiente día
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    // Si terminamos con un bloque abierto, cerrarlo
    if (inicioBloque !== null && finBloque !== null) {
      bloques.push({ inicio: inicioBloque, fin: finBloque });
    }
    
    return bloques;
  }

  // Método para crear una única asignación (lógica original)
  private async createSingleAssignment(createUsuarioTurnoDto: CreateUsuarioTurnoDto): Promise<UsuarioTurno> {
    const usuarioTurno = new UsuarioTurno();
    usuarioTurno.turnoFK = createUsuarioTurnoDto.turnoFK;
    usuarioTurno.usuarioFK = createUsuarioTurnoDto.usuarioFK;
    usuarioTurno.fechaInicio = createUsuarioTurnoDto.fechaInicio;
    usuarioTurno.fechaFin = createUsuarioTurnoDto.fechaFin;
    usuarioTurno.creado = new Date();
    usuarioTurno.actualizado = new Date();
    return this.usuarioTurnoRepository.save(usuarioTurno);
  }

  // Método auxiliar para obtener la fecha correspondiente a un día de la semana específico
  private obtenerFechaPorDiaSemana(fecha: Date, diaSemana: number): Date {
    const result = new Date(fecha);
    const currentDayOfWeek = fecha.getDay();
    const daysToAdd = (diaSemana - currentDayOfWeek + 7) % 7;
    result.setDate(result.getDate() + daysToAdd);
    return result;
  }

  // Verificar si existe asignación que se superpone con otra
  async verificarSuperposicion(usuarioFK: number, fechaInicio: Date, fechaFin: Date, idExcluir?: number): Promise<boolean> {
    const query = this.usuarioTurnoRepository.createQueryBuilder('usuarioTurno')
      .where('usuarioTurno.usuarioFK = :usuarioFK', { usuarioFK })
      .andWhere(
        '(usuarioTurno.fechaInicio <= :fechaFin AND usuarioTurno.fechaFin >= :fechaInicio)',
        { fechaInicio, fechaFin }
      );
    
    if (idExcluir) {
      query.andWhere('usuarioTurno.idUsuarioTurno != :idExcluir', { idExcluir });
    }
    
    const count = await query.getCount();
    return count > 0;
  }

  async findAll() {
    const usuarioTurnos = await this.usuarioTurnoRepository.find({
      relations: ['userTurno', 'turno']
    });
    
    return usuarioTurnos.map(usuarioTurno => new GetUsuarioTurnoDto(usuarioTurno));
  }

  async findOne(id: number): Promise<GetUsuarioTurnoDto> {
    const usuarioTurno = await this.usuarioTurnoRepository.findOne({
      where: { idUsuarioTurno: id },
      relations: ['userTurno', 'turno']
    });
    
    if (!usuarioTurno) {
      throw new NotFoundException(`UsuarioTurno con ID ${id} no encontrado`);
    }
    
    return new GetUsuarioTurnoDto(usuarioTurno);
  }

  async update(id: number, updateUsuarioTurnoDto: UpdateUsuarioTurnoDto): Promise<UsuarioTurno> {
    try {
      const usuarioTurno = await this.usuarioTurnoRepository.findOne({ 
        where: { idUsuarioTurno: id }
      });
      
      if (!usuarioTurno) {
        throw new NotFoundException(`UsuarioTurno con ID ${id} no encontrado`);
      }
  
      const turnoId = updateUsuarioTurnoDto.turnoFK || usuarioTurno.turnoFK;
      const turno = await this.turnoRepository.findOne({ 
        where: { idTurno: turnoId } 
      });
  
      if (!turno) {
        throw new NotFoundException(`Turno con ID ${turnoId} no encontrado`);
      }
  
      // Si el turno tiene configuración de días específicos
      if (turno.diaInicio && turno.diaFin) {
        const fechaInicio = updateUsuarioTurnoDto.fechaInicio 
          ? new Date(updateUsuarioTurnoDto.fechaInicio) 
          : usuarioTurno.fechaInicio;
        
        const fechaFin = updateUsuarioTurnoDto.fechaFin 
          ? new Date(updateUsuarioTurnoDto.fechaFin) 
          : usuarioTurno.fechaFin;
  
        const diaInicioNum = this.diasSemana[turno.diaInicio.toLowerCase()];
        const diaFinNum = this.diasSemana[turno.diaFin.toLowerCase()];
        
        if (diaInicioNum === undefined || diaFinNum === undefined) {
          throw new BadRequestException('Configuración de días en el turno no es válida');
        }
  
        // Calcular los días permitidos para el turno
        const diasPermitidos = this.calcularDiasTurno(diaInicioNum, diaFinNum);
        const nombresDias = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
  
        // Verificar que todas las fechas estén dentro del rango permitido
        const fechaActual = new Date(fechaInicio);
        while (fechaActual <= fechaFin) {
          const diaSemana = fechaActual.getDay();
          if (!diasPermitidos.includes(diaSemana)) {
            const diasPermitidosTexto = diasPermitidos
              .map(dia => nombresDias[dia])
              .join(', ');
            throw new BadRequestException(
              `El día ${nombresDias[diaSemana]} no está permitido para este turno. ` +
              `Los días permitidos son: ${diasPermitidosTexto}`
            );
          }
          fechaActual.setDate(fechaActual.getDate() + 1);
        }
      }
  
      // Actualizar los datos
      const updateData: any = {
        actualizado: new Date()
      };
      
      if (updateUsuarioTurnoDto.turnoFK !== undefined) updateData.turnoFK = updateUsuarioTurnoDto.turnoFK;
      if (updateUsuarioTurnoDto.usuarioFK !== undefined) updateData.usuarioFK = updateUsuarioTurnoDto.usuarioFK;
      if (updateUsuarioTurnoDto.fechaInicio !== undefined) {
        updateData.fechaInicio = new Date(updateUsuarioTurnoDto.fechaInicio);
      }
      if (updateUsuarioTurnoDto.fechaFin !== undefined) {
        updateData.fechaFin = new Date(updateUsuarioTurnoDto.fechaFin);
      }
      
      await this.usuarioTurnoRepository.update(id, updateData);
      
      const result = await this.usuarioTurnoRepository.findOne({
        where: { idUsuarioTurno: id }
      });
      if (!result) {
        throw new NotFoundException(`UsuarioTurno with ID ${id} not found`);
      }
      return result;
  
    } catch (error) {
      if (error instanceof BadRequestException || error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(
        error instanceof Error ? error.message : 'Error al actualizar el usuario turno'
      );
    }
  }
  
  private calcularDiasTurno(diaInicioNum: number, diaFinNum: number): number[] {
    const diasTurno: number[] = [];
    if (diaInicioNum <= diaFinNum) {
      for (let i = diaInicioNum; i <= diaFinNum; i++) {
        diasTurno.push(i);
      }
    } else {
      for (let i = diaInicioNum; i <= 6; i++) {
        diasTurno.push(i);
      }
      for (let i = 0; i <= diaFinNum; i++) {
        diasTurno.push(i);
      }
    }
    return diasTurno;
  }

  async remove(id: number): Promise<void> {
    const result = await this.usuarioTurnoRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`Turno with ID ${id} not found`);
    }
  }
}