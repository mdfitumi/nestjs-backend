import { Module, DynamicModule } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { IoredisModule } from '@mobizerg/nest-ioredis';
import { LoggerModule } from './logger.module';
import { RedisService } from '../providers/redis.service';
import { RedisFactoryService } from '../providers/redis-factory.service';
import { DefaultConfigModule } from './default-config.module';

@Module({
  imports: [DefaultConfigModule, LoggerModule],
  providers: [RedisService, RedisFactoryService],
  exports: [RedisService, RedisFactoryService],
})
export class RedisModule {}
