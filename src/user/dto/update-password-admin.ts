import { IsNumber, IsOptional, IsString, MinLength } from 'class-validator';

export class updatePasswordAdminDto {
  @IsNumber()
  cedula?: number; // Optional: Include if you pass the user ID in the request body

  @IsString()
  @MinLength(6)
  newPassword: string;
}
