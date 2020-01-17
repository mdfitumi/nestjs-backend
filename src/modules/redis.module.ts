import { Module } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { IoredisModule } from '@mobizerg/nest-ioredis';
import { LoggerModule } from './logger.module';
import { RedisService } from '../providers/redis.service';

@Module({
  imports: [
    IoredisModule.register({
      host: '192.168.0.104',
    }),
    LoggerModule,
  ],
  providers: [RedisService],
  exports: [RedisService],
})
export class RedisModule {}
