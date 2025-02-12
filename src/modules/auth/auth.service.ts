import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import { LoginDTO } from './dto/login.dto';
import { createResponse } from 'src/common/utils/response.util';
import { RegisterDTO } from './dto/register.dto';
import { TenantService } from '../tenant/tenant.service';

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,

    @Inject(forwardRef(() => TenantService))
    private readonly tenantService: TenantService,
  ) {}

  async login(payload: LoginDTO) {
    const user = await this.userService.findByEmail(payload.email);

    if (user == null)
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

    // const user = await this.userService.create(payload);

    // return createResponse(user, null);
  }

  async forgotPassword() {}

  async resetPassword() {}

  async me() {}
}
