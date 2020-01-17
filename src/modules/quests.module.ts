import { Module } from '@nestjs/common';
import { InstagramQuestsService } from '../providers';
import { LoggerModule } from './logger.module';
import { RedisModule } from './redis.module';

@Module({
  imports: [LoggerModule, RedisModule],
  providers: [InstagramQuestsService],
  exports: [InstagramQuestsService],
})
export class QuestsModule {}
