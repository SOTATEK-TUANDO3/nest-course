import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import bcrypt from 'bcrypt';
import { constants } from 'src/app/constants/common.constant';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { BaseService } from '../base/base.service';
import { ChangePasswordDto } from './dto/change-password.dto';
import { RequestResetPasswordDto } from './dto/request-reset-password.dto';
import { JwtService } from '@nestjs/jwt';
import { MailerService } from '../Mailer/mail.service';

@Injectable()
export class UserService extends BaseService {
  constructor(
    @Inject(constants.INJECT_TOKEN.AUTH_USER_ID) private readonly currentUserId,
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly mailerService: MailerService,
  ) {
    super();
  }

  async requestResetPassword(requestResetPasswordDto: RequestResetPasswordDto) {
    const { email } = requestResetPasswordDto;

    const user = await this.userRepo.findOneBy({ email });
    if (!user) {
      throw new BadRequestException('User was not found');
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...payload } = user;

    const token = await this.jwtService.sign(payload, {
      expiresIn: '1h',
    });

    const url = `${process.env.API_URL}/reset-password?token=${token}`;
    const to = [email];
    const templatePath = 'public/email-templates/reset-password-email.ejs';
    const templateData = { resetPaswordUrl: url };
    const subject = 'Request reset password';
    await this.mailerService.sendEmail(to, subject, templatePath, templateData);
  }

  async changePassword(changePasswordDto: ChangePasswordDto) {
    const { currentPassword, newPassword, confirmPassword, token } = changePasswordDto;
    const payload = this.jwtService.verify<Omit<User, 'password'>>(token);

    if (!payload) {
      throw new BadRequestException('Token invalid');
    }

    const user = await this.userRepo.findOneBy({ email: payload.email });
    if (!user) {
      throw new BadRequestException('User was not found');
    }

    if (newPassword !== confirmPassword) {
      throw new BadRequestException('New password and confirm password are not equal');
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      throw new BadRequestException('Current password invalid');
    }

    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(newPassword, salt);
    user.password = hashPassword;
    await this.userRepo.save(user);
    return this.responseOk();
  }
}
