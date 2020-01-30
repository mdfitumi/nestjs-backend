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

// nestjs cannot properly read ormconfig.js file, so db is not working
const ormConfig: TypeOrmModuleOptions | undefined =
  process.env.NODE_ENV === 'production'
    ? undefined
    : {
        type: 'postgres',
        host: 'acer',
        port: 5432,
        username: 'test',
        password: 'test',
        database: 'influence_cloud',
        entities,
        migrations: ['migrations'],
        synchronize: false,
        cache: true,
        logging: ['query'],
      };
@Module({
  imports: [
    TypeOrmModule.forRoot(ormConfig),
    TypeOrmModule.forFeature(entities),
    LoggerModule,
  ],
  providers: [InstagramStorageService, PublicStorageService],
  exports: [InstagramStorageService, PublicStorageService],
})
export class StorageModule {}
