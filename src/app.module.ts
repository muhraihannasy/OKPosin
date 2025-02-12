import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { PrismaService } from './common/modules/prisma/prisma.service';
import { PrismaModule } from './common/modules/prisma/prisma.module';
import { TenantModule } from './modules/tenant/tenant.module';

@Module({
  imports: [UserModule, AuthModule, PrismaModule, TenantModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
