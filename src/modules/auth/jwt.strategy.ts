import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import jwtconfigure from '../../config/jwt.config';
import { ConfigType } from '@nestjs/config';
import { Repository } from 'typeorm';
import { User } from 'src/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    @Inject(jwtconfigure.KEY) private jwtConfig: ConfigType<typeof jwtconfigure>,
    @InjectRepository(User) private usersRepo: Repository<User>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: jwtConfig.secret,
      ignoreExpiration: false,
    });
  }

  async validate(payload: any) {
    const { email } = payload;
    const user = await this.usersRepo.findOneBy({ email });
    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
