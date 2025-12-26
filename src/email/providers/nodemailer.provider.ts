import { Injectable } from '@nestjs/common';
import { createTransport } from 'nodemailer';
import { MailProvider } from '../email.interface';

@Injectable()
export class NodemailerProvider implements MailProvider {
  private transporter = createTransport({
    service: 'gmail',
    auth: {
      type: 'OAuth2',
      user: process.env.GMAIL_USER,
      clientId: process.env.GMAIL_CLIENT_ID,
      clientSecret: process.env.GMAIL_CLIENT_SECRET,
      refreshToken: process.env.GMAIL_REFRESH_TOKEN,
    },
  });

  async sendMail({ to, subject, html, from }: any): Promise<void> {
    await this.transporter.sendMail({
      from: from || `"Bflexi" <${process.env.GMAIL_USER}>`,
      to,
      subject,
      html,
    });
  }
}
