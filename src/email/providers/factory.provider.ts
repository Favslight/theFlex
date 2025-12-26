import { Injectable } from '@nestjs/common';
import { NodemailerProvider } from './nodemailer.provider';
import { ResendProvider } from './resend.provider';
import { MailProvider, ProviderOptions } from '../email.interface';

@Injectable()
export class MailProviderFactory {
  constructor(
    private readonly nodemailerProvider: NodemailerProvider,
    private readonly resendProvider: ResendProvider,
  ) {}

  getProvider(name: ProviderOptions): MailProvider {
    switch (name) {
      case ProviderOptions.resend:
        return this.resendProvider;
      case ProviderOptions.nodemailer:
        return this.nodemailerProvider;
      default:
        throw new Error(`Unsupported mail provider: ${name}`);
    }
  }
}
