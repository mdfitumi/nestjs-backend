import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InstagramStorageService } from '../providers';
import {
  InstagramCampaignEntity,
  InstagramQuestTypeEntity,
  CurrencyEntity,
  InstagramEntity,
  ServerEntity,
  UserEntity,
} from '../entities';

@Module({
  imports: [
    TypeOrmModule.forRoot(),
    TypeOrmModule.forFeature([
      InstagramCampaignEntity,
      InstagramQuestTypeEntity,
      CurrencyEntity,
      InstagramEntity,
      ServerEntity,
      UserEntity,
    ]),
  ],
  providers: [InstagramStorageService],
  exports: [InstagramStorageService],
})
export class StorageModule {}
