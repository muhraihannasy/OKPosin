import { forwardRef, Module } from '@nestjs/common';
import { CategoryService } from './service/category.service';
import { CategoryController } from './category.controller';
import { PrismaModule } from 'src/common/modules/prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  controllers: [CategoryController],
  providers: [CategoryService],
  imports: [PrismaModule],
})
export class CategoryModule {}
