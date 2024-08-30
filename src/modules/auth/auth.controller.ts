import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { ApiOperation } from '@nestjs/swagger';
import { LoginDto } from './dto/login.dto';
import { VerifyDto } from './dto/verify.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({ summary: 'signUp' })
  @Post('signUp')
  async signUp(@Body() user: RegisterDto) {
    return this.authService.register(user);
  }

  @ApiOperation({ summary: 'login' })
  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @ApiOperation({ summary: 'verify account' })
  @Get('verify-account')
  async verifyAccount(@Query() query: VerifyDto) {
    return this.authService.verifyAccount(query.token);
  }
}
