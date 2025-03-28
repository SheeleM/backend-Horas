// src/user/dto/security-question-request.dto.ts
import { IsNotEmpty, IsNumber } from 'class-validator';

export class SecurityQuestionRequestDto {
  @IsNotEmpty({ message: 'La cédula es requerida' })
  @IsNumber({}, { message: 'La cédula debe ser un número válido' })
  cedula: number;
}
