import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  checkHealth() {
    return {
      status: 'ok',
      env: process.env.NODE_ENV,
    };
  }
}
