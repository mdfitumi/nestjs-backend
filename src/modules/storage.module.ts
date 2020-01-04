import { Module } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { InstagramStorageService } from '../providers';
import {
  InstagramCampaignEntity,
  InstagramQuestTypeEntity,
  CurrencyEntity,
  InstagramEntity,
  ServerEntity,
  UserEntity,
} from '../entities';

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
        entities: [
          InstagramCampaignEntity,
          InstagramQuestTypeEntity,
          CurrencyEntity,
          InstagramEntity,
          ServerEntity,
          UserEntity,
        ],
        migrations: ['migrations'],
        synchronize: false,
        cache: true,
      };
@Module({
  imports: [
    TypeOrmModule.forRoot(ormConfig),
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
