// mail-provider.interface.ts
export interface MailProvider {
  sendMail(options: {
    to: string;
    subject: string;
    html: string;
    from?: string;
  }): Promise<void>;
}

export enum ProviderOptions {
  resend = 'resend',
  nodemailer = 'nodemailer',
}
