import { Global, Module } from '@nestjs/common';
import { EmailService } from './email.service';
import {
  MailProviderFactory,
  NodemailerProvider,
  ResendProvider,
} from './providers';

@Global()
@Module({
  providers: [
    EmailService,
    MailProviderFactory,
    NodemailerProvider,
    ResendProvider,
  ],
  exports: [EmailService],
})
export class EmailModule {}
