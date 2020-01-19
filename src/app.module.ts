import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { InstagramController, AuthController } from './controllers';
import { ConfigModule } from './modules/config.module';
import {
  SchedulerModule,
  LoggerModule,
  StorageModule,
  QuestsModule,
  RedisModule,
} from './modules';

@Module({
  imports: [
    StorageModule,
    SchedulerModule,
    LoggerModule,
    QuestsModule,
    RedisModule,
    ConfigModule.register({ folder: '../' }),
  ],
  controllers: [AppController, InstagramController, AuthController],
  providers: [AppService],
})
export class AppModule {}
