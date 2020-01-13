import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { StorageModule } from './modules/storage.module';
import { InstagramController } from './controllers/instagram.controller';
import { SchedulerModule } from './modules/scheduler.module';

@Module({
  imports: [StorageModule, SchedulerModule],
  controllers: [AppController, InstagramController],
  providers: [AppService],
})
export class AppModule {}
