import { Module } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { InstagramStorageService, PublicStorageService } from '../providers';
import { LoggerModule } from './logger.module';
import {
  InstagramCampaignEntity,
  InstagramQuestTypeEntity,
  CurrencyEntity,
  InstagramEntity,
  ServerEntity,
  PublicUserEntity,
  InstagramActiveCampaignEntity,
  InstagramCompletedQuestEntity,
} from '../entities';

const entities = [
  InstagramCampaignEntity,
  InstagramQuestTypeEntity,
  CurrencyEntity,
  InstagramEntity,
  ServerEntity,
  PublicUserEntity,
  InstagramActiveCampaignEntity,
  InstagramCompletedQuestEntity,
];

@Module({
  imports: [
    TypeOrmModule.forRoot(),
    TypeOrmModule.forFeature(entities),
    LoggerModule,
  ],
  providers: [InstagramStorageService, PublicStorageService],
  exports: [InstagramStorageService, PublicStorageService],
})
export class StorageModule {}
