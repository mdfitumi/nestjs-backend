import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { InstagramController, AuthController } from './controllers';
import { SchedulerModule, LoggerModule, StorageModule } from './modules';

@Module({
  imports: [StorageModule, SchedulerModule, LoggerModule],
  controllers: [AppController, InstagramController, AuthController],
  providers: [AppService],
})
export class AppModule {}
