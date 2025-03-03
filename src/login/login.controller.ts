import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { LoginService } from './login.service';
import { CreateLoginDto } from './dto/create-login.dto';
import { UpdateLoginDto } from './dto/update-login.dto';
import { JwtAuthGuard } from './JwtAuthGuard';
import { Request as ExpressRequest } from 'express';
import { User } from 'src/user/entities/user.entity';

export interface RequestWithUser extends Request {
  user: User;
}

@Controller('login')
export class LoginController {
  constructor(private readonly loginService: LoginService) {}

  @Post('login')
  async login(@Body() createLoginDto: CreateLoginDto) {
    return this.loginService.login(createLoginDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req: RequestWithUser) {
    return req.user;
  }

}
