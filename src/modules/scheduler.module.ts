import { Module } from '@nestjs/common';
import { StorageModule } from './storage.module';
import { SchedulerService } from '../providers/scheduler.service';
import { LoggerModule } from './logger.module';
import { RedisModule } from './redis.module';

@Module({
  imports: [StorageModule, RedisModule, LoggerModule],
  providers: [SchedulerService],
})
export class SchedulerModule {}
