import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { BaseService } from '../base/base.service';
import * as ejs from 'ejs';
import * as nodemailer from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';
import mailerConfigure from '../../config/mailer.config';
import { ConfigType } from '@nestjs/config';

@Injectable()
export class MailerService extends BaseService {
  private readonly transporter: nodemailer.Transporter;
  constructor(@Inject(mailerConfigure.KEY) private mailerConfig: ConfigType<typeof mailerConfigure>) {
    super();
  }

  async sendEmail(
    to: string[],
    subject: string,
    templatePath: string,
    templateData: { [key: string]: any },
    imagePath?: string,
  ) {
    const renderedTemplate = await ejs.renderFile(templatePath, templateData);

    const mailOptions: Mail.Options = {
      from: this.mailerConfig.sender,
      to: to,
      subject: subject,
      html: renderedTemplate,
      ...(imagePath && {
        attachments: [
          {
            path: imagePath,
            cid: 'img',
          },
        ],
      }),
    };

    try {
      await this.transporter.sendMail(mailOptions);
      return this.responseOk();
    } catch (error) {
      console.log(error);
      throw new BadRequestException('Fail to send email!');
    }
  }
}
