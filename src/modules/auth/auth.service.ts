import {
  BadRequestException,
  forwardRef,
  Get,
  HttpCode,
  Inject,
  Injectable,
  Request,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';

import { JwtService } from '@nestjs/jwt';

import { AuthGuard } from '@nestjs/passport';

import * as bcrypt from 'bcrypt';

import { createResponse } from 'src/common/utils/response.util';

import { TenantService } from '../tenant/tenant.service';
import { UserService } from '../user/user.service';

import { LoginDTO } from './dto/login.dto';
import { RegisterDTO } from './dto/register.dto';
import { User } from '@prisma/client';

@Injectable()
export class AuthService {
  private readonly SALT_ROUND = 12;

  constructor(
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,

    @Inject(forwardRef(() => TenantService))
    private readonly tenantService: TenantService,

    private jwtService: JwtService,
  ) {}

  async login(payload: User) {
    const payload_user = {
      sub: payload.id,
      email: payload.email,
    };

    const access_token = await this.jwtService.sign(payload_user);

    return {
      access_token,
      status: 200,
    };
  }

  async register(payload: RegisterDTO) {
    const isEmailAlreadyExist = await this.userService.findByEmail(
      payload.email,
    );

    if (isEmailAlreadyExist)
      throw new BadRequestException(
        createResponse(null, [
          {
            field: 'email',
            code: 'EMAIL_UNIQUE',
            message: 'Email already exist',
          },
        ]),
      );

    const tenant = await this.tenantService.create({
      name: payload.tenant_name,
      address: payload.tenant_address,
    });

    let user = await this.userService.create({
      name: payload.name,
      tenant_id: tenant.id,
      phone: payload.phone,
      email: payload.email,
      password: payload.password,
    });

    const { name, phone, email, created_at } = user;

    return createResponse(
      {
        name,
        phone,
        email,
        created_at,
      },
      null,
    );
  }

  async forgotPassword() {}

  async resetPassword() {}

  // @UseGuards(AuthGuard)

  async me(req: Request) {
    return req;
  }

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.userService.findByEmail(email);

    const isPasswordValid = user
      ? await this.verifyPassword(pass, user.password)
      : false;

    if (user == null || !isPasswordValid) return null;

    const { password, ...result } = user;

    return result;
  }

  async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(this.SALT_ROUND);
    const hashedPassword = await bcrypt.hash(password, salt);

    return hashedPassword;
  }

  async verifyPassword(password: string, hashedPassword: string) {
    return await bcrypt.compare(password, hashedPassword);
  }
}
