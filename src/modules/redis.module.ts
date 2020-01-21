import { Module, DynamicModule } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { IoredisModule } from '@mobizerg/nest-ioredis';
import { LoggerModule } from './logger.module';
import { InstagramRedisService } from '../providers/instagram-redis.service';
import { RedisFactoryService } from '../providers/redis-factory.service';
import { DefaultConfigModule } from './default-config.module';

@Module({
  imports: [DefaultConfigModule, LoggerModule],
  providers: [InstagramRedisService, RedisFactoryService],
  exports: [InstagramRedisService, RedisFactoryService],
})
export class RedisModule {}
