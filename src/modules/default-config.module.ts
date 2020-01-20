import { Module } from '@nestjs/common';
import { ConfigModule, DEFAULT_CONFIG_MODULE_OPTIONS } from './config.module';

@Module({
  imports: [ConfigModule.register(DEFAULT_CONFIG_MODULE_OPTIONS)],
  exports: [ConfigModule],
})
export class DefaultConfigModule {}
