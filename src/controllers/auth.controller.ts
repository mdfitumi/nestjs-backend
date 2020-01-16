import { Controller, Get } from '@nestjs/common';

@Controller('auth')
export class AuthController {
  @Get('/cb')
  authCallback() {
    console.log('authCallback');
  }
}
