import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import * as bcrypt from 'bcrypt';

import { createResponse } from 'src/common/utils/response.util';

import { TenantService } from '../tenant/tenant.service';
import { UserService } from '../user/user.service';

import { LoginDTO } from './dto/login.dto';
import { RegisterDTO } from './dto/register.dto';

@Injectable()
export class AuthService {
  private readonly SALT_ROUND = 12;

  constructor(
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,

    @Inject(forwardRef(() => TenantService))
    private readonly tenantService: TenantService,
  ) {}

  async login(payload: LoginDTO) {
    const user = await this.userService.findByEmail(payload.email);

    const isPasswordValid = user
      ? await this.verifyPassword(payload.password, user.password)
      : false;

    if (user == null || !isPasswordValid)
      throw new UnauthorizedException(createResponse(null, 'Unauthorized'));

    return {
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

  async me() {}

  async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(this.SALT_ROUND);
    const hashedPassword = await bcrypt.hash(password, salt);

    return hashedPassword;
  }

  async verifyPassword(password: string, hashedPassword: string) {
    return await bcrypt.compare(password, hashedPassword);
  }
}
