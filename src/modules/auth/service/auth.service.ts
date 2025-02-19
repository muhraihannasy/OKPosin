import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
} from '@nestjs/common';
import { User } from '@prisma/client';

import { createResponse } from 'src/common/utils/response.util';

import { JwtService } from '@nestjs/jwt';
import { TenantService } from '../../tenant/tenant.service';
import { UserService } from '../../user/user.service';
import { BcryptService } from './bcrypt.service';

import { RegisterDTO } from '../dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,

    @Inject(forwardRef(() => TenantService))
    private readonly tenantService: TenantService,

    private jwtService: JwtService,

    private bcryptService: BcryptService,
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

  async currentUser() {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.userService.findByEmail(email);

    const isPasswordValid = user
      ? await this.bcryptService.verifyPassword(pass, user.password)
      : false;

    if (user == null || !isPasswordValid) return null;

    const { password, ...result } = user;

    return result;
  }
}
