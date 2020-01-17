import { Module } from '@nestjs/common';
import { StorageModule } from './storage.module';
import { SchedulerService } from '../providers/scheduler.service';
import { LoggerModule } from './logger.module';

@Module({
  imports: [StorageModule, LoggerModule],
  providers: [SchedulerService],
})
export class SchedulerModule {}
