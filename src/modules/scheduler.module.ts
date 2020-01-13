import { Module } from '@nestjs/common';
import { StorageModule } from './storage.module';
import { SchedulerService } from '../providers/scheduler.service';

@Module({
  imports: [StorageModule],
  providers: [SchedulerService],
})
export class SchedulerModule {}
