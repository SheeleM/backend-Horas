import { IsInt, IsPositive, IsOptional, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateUserDto {
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @IsPositive()
    id?: number;

    @IsOptional()
    @IsBoolean()
    estado?: boolean;

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @IsPositive()
    rol?: number;
}