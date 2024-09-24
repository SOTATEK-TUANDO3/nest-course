import { Global, Module, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { DataSource } from 'typeorm';
import { User } from '../../entities/user.entity';
import { constants } from '../../app/constants/common.constant';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

const authUserFactory = {
  provide: constants.INJECT_TOKEN.AUTH_USER_ID,
  scope: Scope.REQUEST,
  useFactory: async (request: Request, dataSource: DataSource, jwtService: JwtService) => {
    try {
      let token = request.headers.authorization.split(' ')[1];
      const payload = jwtService.verify(token);
      if (!payload) return null;
      const currentUser = await dataSource.getRepository(User).findOneBy({ id: payload.id });

      return currentUser?.id || null;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      return null;
    }
  },
  inject: [REQUEST, DataSource, JwtService],
};

@Global()
@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        return {
          secret: configService.get('jwt.secret'),
          signOptions: {
            expiresIn: configService.get('jwt.expiresIn'),
          },
        };
      },
    }),
  ],
  providers: [authUserFactory],
  exports: [constants.INJECT_TOKEN.AUTH_USER_ID],
})
export class AuthUserModule {}
