import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, SetMetadata, Session } from '@nestjs/common';
import { LoginService } from './login.service';
import { CreateLoginDto } from './dto/create-login.dto';
import { UpdateLoginDto } from './dto/update-login.dto';
import { JwtAuthGuard } from './JwtAuthGuard';
import { Request as ExpressRequest } from 'express';
import { User } from 'src/user/entities/user.entity';

export interface RequestWithUser extends Request {
  user: User;
}
export const Public = () => SetMetadata('your-secret-key', true);
@Controller('auth')
export class LoginController {
  constructor(private readonly loginService: LoginService) {}

  @Public()
  @Post('login')
  async login(@Body() createLoginDto: CreateLoginDto, @Session() session: Record<string, any>) {
    console.log("entro al login");
    session.userId = "idSession1";
    return this.loginService.login(createLoginDto,session);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req: RequestWithUser) {
    return req.user;
  }

}
