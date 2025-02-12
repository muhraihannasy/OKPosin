import { Body, Controller, Patch, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ZodPipe } from 'src/common/pipe/zod/zod.pipe';

import { LoginSchema } from './schema/login.schema';
import { RegisterSchema } from './schema/register.schema';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  login(@Body(new ZodPipe(LoginSchema)) body) {
    return this.authService.login(body);
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

  @Post('me')
  me() {}
}
