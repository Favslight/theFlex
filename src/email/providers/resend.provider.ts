import { MailProvider } from '../email.interface';
import { Resend } from 'resend';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ResendProvider implements MailProvider {
  private resend = new Resend(process.env.RESEND_API_KEY);

  async sendMail({ to, subject, html, from }: any): Promise<void> {
    await this.resend.emails.send({
      from: from || `Bflexi <${process.env.FROM_EMAIL}>`,
      to,
      subject,
      html,
    });
  }
}
