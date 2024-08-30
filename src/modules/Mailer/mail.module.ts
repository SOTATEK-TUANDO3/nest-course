import { Module } from '@nestjs/common';
import { MailerService } from './mail.service';
import { ConfigModule } from '@nestjs/config';
import mailerConfig from '../../config/mailer.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [mailerConfig],
    }),
  ],
  providers: [MailerService],
  exports: [MailerService],
})
export class MailModule {}
