import { Injectable } from '@nestjs/common';
import { ConfigService } from './providers/config.service';

@Injectable()
export class AppService {
  constructor(private readonly config: ConfigService) {}
  getHello(): string {
    return `Hello ${this.config.env.SERVICE_AUD}!`;
  }
}
