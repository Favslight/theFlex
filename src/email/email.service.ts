import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import * as handlebars from 'handlebars';
import { MailProviderFactory } from './providers';
import { MailProvider, ProviderOptions } from './email.interface';

@Injectable()
export class EmailService {
  private transporter: MailProvider;
  constructor(private mailFactory: MailProviderFactory) {
    this.transporter = this.mailFactory.getProvider(ProviderOptions.resend);
  }

  async sendOtp(
    email: string,
    userName: string,
    otpCode: string,
  ): Promise<void> {
    const templatePath = path.join(__dirname, 'templates', 'otp.template.hbs');
    const templateSource = fs.readFileSync(templatePath, 'utf-8');
    const template = handlebars.compile(templateSource);
    const html = template({ userName, otpCode });

    await this.transporter.sendMail({
      from: `"Bflexi" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: 'Verify Your Email - OTP Code',
      html,
    });
  }

  async welcome(email: string, userName: string) {
    const templatePath = path.join(
      __dirname,
      'templates',
      'welcome.template.hbs',
    );
    const templateSource = fs.readFileSync(templatePath, 'utf-8');
    const template = handlebars.compile(templateSource);
    const html = template({ userName });

    await this.transporter.sendMail({
      from: `"Bflexi" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: 'Welcome to Bflexi',
      html,
    });
  }
}
