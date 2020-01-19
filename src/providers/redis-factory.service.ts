import { Injectable, Inject } from '@nestjs/common';
import { Redis, RedisOptions } from 'ioredis';
import * as IORedis from 'ioredis';
import { IcLogger } from './logger';
import { ConfigService } from './config.service';
import { RedisService } from './redis.service';

@Injectable()
export class RedisFactoryService {
  constructor(
    private readonly config: ConfigService,
    private readonly logger: IcLogger,
  ) {
    this.logger.setContext('RedisFactoryService');
  }

  create(): Redis {
    this.logger.debug('create');
    return new IORedis(RedisService.parseOptions(this.config.env.REDIS_URL));
  }
}
