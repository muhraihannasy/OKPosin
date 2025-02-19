import { forwardRef, Module } from '@nestjs/common';
import { AuthService } from '../auth/service/auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';
import { TenantModule } from '../tenant/tenant.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './strategy/jwt.strategy';
import { PrismaModule } from 'src/common/modules/prisma/prisma.module';
import { LocalStrategy } from './strategy/local.strategy';
import { BcryptService } from './service/bcrypt.service';

@Module({
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy, BcryptService],
  exports: [AuthService, BcryptService],
  imports: [
    PassportModule,
    PrismaModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: { expiresIn: configService.get('JWT_EXPIRATION') },
      }),
    }),
    forwardRef(() => UserModule),
    forwardRef(() => TenantModule),
  ],
})
export class AuthModule {}
