import { Inject, Injectable } from '@nestjs/common';
import { CreateCategoryDto } from '../dto/create-category.dto';
import { UpdateCategoryDto } from '../dto/update-category.dto';
import { PrismaService } from 'src/common/modules/prisma/prisma.service';
import { AuthService } from 'src/modules/auth/service/auth.service';

@Injectable()
export class CategoryService {
  constructor(private prisma: PrismaService) {}

  create(createCategoryDto: CreateCategoryDto) {
    return 'This action adds a new category';
  }

  async findAll(tenant_id: number) {
    const data = await this.prisma.itemCategory.findMany({
      where: {
        tenant_id,
      },
    });

    return data;
  }

  async findOne(id: number, tenant_id: number) {
    const data = await this.prisma.itemCategory.findFirst({
      where: {
        id,
        tenant_id,
      },
    });

    return data;
  }

  update(id: number, updateCategoryDto: UpdateCategoryDto) {
    return `This action updates a #${id} category`;
  }

  remove(id: number) {
    return `This action removes a #${id} category`;
  }
}
