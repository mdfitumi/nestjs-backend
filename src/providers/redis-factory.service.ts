import { Injectable, Inject } from '@nestjs/common';
import { Redis, RedisOptions } from 'ioredis';
import * as IORedis from 'ioredis';
import { IcLogger } from './logger';

@Injectable()
export class RedisFactoryService {
  constructor(
    @Inject('REDIS_OPTIONS') private readonly options: RedisOptions,
    private readonly logger: IcLogger,
  ) {
    this.logger.setContext('RedisFactoryService');
  }

  create(): Redis {
    this.logger.debug('create');
    return new IORedis(this.options);
  }
}
