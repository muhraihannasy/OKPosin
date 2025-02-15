import { Injectable } from '@nestjs/common';
import { UpdateTenantDto } from './dto/update-tenant.dto';
import { CreateTenantDTO } from './dto/create-tenant.dto';
import { PrismaService } from 'src/common/modules/prisma/prisma.service';
import { generateSequentialCode } from 'src/common/utils/generate-code.utils';

@Injectable()
export class TenantService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createTenantDto: CreateTenantDTO) {
    const lastTenant = await this.prisma.tenant.findFirst({
      orderBy: {
        id: 'desc',
      },
      take: 1,
    });

    const sequence = lastTenant !== null ? lastTenant?.sequence + 1 : 1;

    const payload = {
      ...createTenantDto,
      code: await this.generateCode(sequence),
      sequence,
    };
    console.log(payload);

    const tenant = await this.prisma.tenant.create({
      data: payload,
    });

    return tenant;
  }

  findAll() {
    return `This action returns all tenant`;
  }

  findOne(id: number) {
    return `This action returns a #${id} tenant`;
  }

  update(id: number, updateTenantDto: UpdateTenantDto) {
    return `This action updates a #${id} tenant`;
  }

  remove(id: number) {
    return `This action removes a #${id} tenant`;
  }

  async generateCode(sequence: number) {
    const code = generateSequentialCode(sequence, 'OKPOSIN', 6);

    return code;
  }
}
