import { Controller, Get, UseGuards, Req, Body, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { CreateUserDto } from './dto/create-user.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('profile')
  getProfile(@Req() req: Request) {
    return req.user;
  }

  @Post('user')
  async createUser(@Body() req: CreateUserDto) {
    return this.appService.addUser(req);
  }
}
