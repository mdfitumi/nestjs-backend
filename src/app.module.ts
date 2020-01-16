import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { StorageModule } from './modules/storage.module';
import { InstagramController, AuthController } from './controllers';
import { SchedulerModule } from './modules/scheduler.module';

@Module({
  imports: [StorageModule, SchedulerModule],
  controllers: [AppController, InstagramController, AuthController],
  providers: [AppService],
})
export class AppModule {}
