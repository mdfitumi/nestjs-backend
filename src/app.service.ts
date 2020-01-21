import { Injectable } from '@nestjs/common';
import { ConfigService } from './providers/config.service';
import { PublicStorageService } from './providers/public-storage.service';
import { IcLogger } from './providers/logger';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class AppService {
  constructor(
    private readonly config: ConfigService,
    private readonly publicStorage: PublicStorageService,
    private readonly logger: IcLogger,
  ) {
    this.logger.setContext('AppService');
  }
  getHello(): string {
    return `Hello ${this.config.env.AUTH0_AUDIENCE}!`;
  }
  async addUser(user: CreateUserDto) {
    return this.publicStorage.addAccount(user);
  }
}
