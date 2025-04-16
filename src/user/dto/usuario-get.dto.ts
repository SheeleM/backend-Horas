import { IsInt, IsString, MinLength } from "class-validator";

export class GetUserioDto {

  @IsString()
  @MinLength(1)
  fullname: string;

  @IsInt()
  id:number;

}