import { Module } from '@nestjs/common';
import { IcLogger } from '../providers/logger';

@Module({
  providers: [IcLogger],
  exports: [IcLogger],
})
export class LoggerModule {}
