import { Module } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { IoredisModule } from '@mobizerg/nest-ioredis';
import { LoggerModule } from './logger.module';
import { RedisService } from '../providers/redis.service';
import { RedisFactoryService } from '../providers/redis-factory.service';
import { RedisOptions } from 'ioredis';

@Module({
  imports: [
    IoredisModule.register({
      host: '192.168.0.104',
    }),
    LoggerModule,
  ],
  providers: [
    RedisService,
    {
      provide: 'REDIS_OPTIONS',
      useValue: {
        host: '192.168.0.104',
      } as RedisOptions,
    },
    RedisFactoryService,
  ],
  exports: [RedisService, RedisFactoryService],
})
export class RedisModule {}
