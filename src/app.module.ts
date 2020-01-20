import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { InstagramController, AuthController } from './controllers';
import { DefaultConfigModule } from './modules/default-config.module';
import { AuthzModule } from './modules/authz.module';
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
    AuthzModule,
    DefaultConfigModule,
  ],
  controllers: [AppController, InstagramController, AuthController],
  providers: [AppService],
})
export class AppModule {}
