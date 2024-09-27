import { BadRequestException, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { RegisterDto } from './dto/register.dto';
import { BaseService } from '../base/base.service';
import { JwtService } from '@nestjs/jwt';
import jwtConfigure from '../../config/jwt.config';
import { ConfigType } from '@nestjs/config';
import { MailerService } from '../Mailer/mail.service';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService extends BaseService {
  constructor(
    @Inject(jwtConfigure.KEY) private jwtConfig: ConfigType<typeof jwtConfigure>,
    @InjectRepository(User) private usersRepo: Repository<User>,
    private jwtService: JwtService,
    private mailerService: MailerService,
  ) {
    super();
  }

  async register(user: RegisterDto) {
    const { userName, password, email } = user;
    const existedUser = await this.usersRepo.findOneBy({ email });
    if (existedUser) {
      throw new BadRequestException('email has been registered!');
    }

    const newUser = this.usersRepo.create();
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    newUser.email = email;
    newUser.userName = userName;
    newUser.password = hashedPassword;
    newUser.isVerified = false;
    await this.usersRepo.save(newUser);

    await this.sendEmailVerify(newUser.email);
  }

  async verifyAccount(token: string) {
    const payload = this.jwtService.verify(token, {
      secret: this.jwtConfig.secret,
    });

    if (typeof payload === 'object' && 'email' in payload) {
      const user = await this.usersRepo.findOneBy({ email: payload.email });
      if (user.isVerified) {
        throw new BadRequestException('Email confirmation token expired');
      }

      user.isVerified = true;
      await this.usersRepo.save(user);
      return this.responseOk(null, 'Email verified successfully!');
    }

    throw new BadRequestException('Invalid or expired token.');
  }

  async findOne(email: string) {
    return await this.usersRepo.findOneBy({ email });
  }

  async login(loginDto: LoginDto) {
    const { userName, password } = loginDto;
    const user = await this.usersRepo.findOneBy({ userName });
    if (!user) {
      throw new UnauthorizedException('User is not found!');
    }
    if (!user.isVerified) {
      await this.sendEmailVerify(user.email);
      return {
        message: 'Your account is not verified.Please check your email to verify your account.',
      };
    }

    if (bcrypt.compare(password, user.password)) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = user;
      return {
        access_token: this.jwtService.sign(result),
      };
    }
    throw new UnauthorizedException();
  }

  async sendEmailVerify(email: string) {
    const token = this.jwtService.sign(
      { email },
      {
        secret: this.jwtConfig.secret,
        expiresIn: '1h',
      },
    );

    const url = `${process.env.API_URL}/verify-account?token=${token}`;
    const to = [email];
    const templatePath = 'public/email-templates/verify-email.ejs';
    const templateData = { clientVerifyUrl: url };
    const subject = 'Vefiry your account';
    await this.mailerService.sendEmail(to, subject, templatePath, templateData);
  }
}
