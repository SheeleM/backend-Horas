// src/user/dto/security-question-response.dto.ts
export class SecurityQuestionResponseDto {
  success: boolean;
  question?: string;
  message?: string;
  userId?: number;
}
