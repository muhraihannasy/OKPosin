import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/common/modules/prisma/prisma.service';
import { AuthService } from '../auth/service//auth.service';
import { CreateUserDTO } from './dto/create-user.dto';
import { BcryptService } from '../auth/service/bcrypt.service';

@Injectable()
export class UserService {
  constructor(
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,

    @Inject(forwardRef(() => BcryptService))
    private readonly bcryptService: BcryptService,

    private readonly prisma: PrismaService,
  ) {}

  async create(createUserDto: CreateUserDTO) {
    const password = await this.bcryptService.hashPassword(
      createUserDto.password,
    );

    return await this.prisma.user.create({
      data: {
        ...createUserDto,
        password,
      },
    });
  }

  findAll() {
    return `This action returns all user`;
  }

  async findByEmail(email: string) {
    return await this.prisma.user.findFirst({
      where: {
        email,
      },
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
