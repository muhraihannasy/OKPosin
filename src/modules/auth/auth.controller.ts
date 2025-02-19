import {
  Body,
  Controller,
  Get,
  HttpCode,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from '../auth/service/auth.service';
import { ZodPipe } from 'src/common/pipe/zod/zod.pipe';

import { RegisterSchema } from './schema/register.schema';
import { JwtAuthGuard } from './guard/jwt-auth.guard';
import { LocalAuthGuard } from './guard/local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  login(@Request() req) {
    return this.authService.login(req.user);
  }

  @Post('register')
  register(@Body(new ZodPipe(RegisterSchema)) body) {
    return this.authService.register(body);
  }

  @Post('forgot-password')
  forgotPassword() {
    return this.authService.forgotPassword();
  }

  @Patch('reset-password')
  resetPassword() {}

  @UseGuards(JwtAuthGuard)
  @Get('me')
  @HttpCode(200)
  me(@Request() req) {
    return req.user;
  }

  @UseGuards(LocalAuthGuard)
  @Post('logout')
  @HttpCode(200)
  async logout(@Request() req) {
    return req.logout();
  }
}
