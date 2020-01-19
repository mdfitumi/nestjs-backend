import { Module } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { IoredisModule } from '@mobizerg/nest-ioredis';
import { InstagramStorageService } from '../providers';
import { LoggerModule } from './logger.module';
import {
  InstagramCampaignEntity,
  InstagramQuestTypeEntity,
  CurrencyEntity,
  InstagramEntity,
  ServerEntity,
  UserEntity,
  InstagramActiveCampaignEntity,
} from '../entities';

const entities = [
  InstagramCampaignEntity,
  InstagramQuestTypeEntity,
  CurrencyEntity,
  InstagramEntity,
  ServerEntity,
  UserEntity,
  InstagramActiveCampaignEntity,
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
      };
@Module({
  imports: [
    TypeOrmModule.forRoot(ormConfig),
    TypeOrmModule.forFeature(entities),
    LoggerModule,
  ],
  providers: [InstagramStorageService],
  exports: [InstagramStorageService],
})
export class StorageModule {}
