import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  UseGuards,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';

// Guard
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';

// Service
import { CategoryService } from './service/category.service';

// DTO
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { GetUser } from 'src/common/decorators/get-user.decorator';
import { User } from '@prisma/client';
import { createResponse } from 'src/common/utils/response.util';

@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoryService.create(createCategoryDto);
  }

  @Get()
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  async findAll(@GetUser() user: User) {
    const categories = await this.categoryService.findAll(user?.tenant_id);

    return createResponse(categories, null);
  }

  @Get(':id')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  async findOne(@Param('id') id: string, @GetUser() user: User) {
    const category = await this.categoryService.findOne(+id, user.tenant_id);

    if (!category)
      throw new NotFoundException(createResponse(null, 'Category not found'));

    return category;
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoryService.update(+id, updateCategoryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.categoryService.remove(+id);
  }
}
