import { Injectable } from '@nestjs/common';
import { InjectRedis } from '@mobizerg/nest-ioredis';
import { Redis } from 'ioredis';
import { InstagramQuestEntity } from '../entities';
import { Observable, fromEvent, concat, defer } from 'rxjs';
import { IcLogger } from './logger';
import { RedisFactoryService } from './redis-factory.service';
import { ignoreElements } from 'rxjs/operators';

@Injectable()
export class RedisService {
  constructor(
    @InjectRedis() private readonly redis: Redis,
    private readonly factory: RedisFactoryService,
    private readonly logger: IcLogger,
  ) {
    this.logger.setContext('RedisService');
  }

  static createCampaignChannelName(campaignId: number) {
    return `channel:${campaignId}`;
  }

  static createCampaignQuestsChannelName(campaignId: number) {
    return `campaign_quests:${campaignId}`;
  }

  publishCampaignQuest(campaignId: number, quest: InstagramQuestEntity) {
    this.logger.debug(
      `publishCampaignQuest ${campaignId} ${JSON.stringify(quest)}`,
    );
    return this.redis.publish(
      RedisService.createCampaignQuestsChannelName(campaignId),
      JSON.stringify(quest),
    );
  }

  getInstagramQuests(campaignId: number): Observable<InstagramQuestEntity> {
    this.logger.debug(`getInstagramQuests ${campaignId}`);
    const channelId = RedisService.createCampaignQuestsChannelName(campaignId);
    const redis = this.factory.create();
    return concat(
      defer(() => redis.subscribe(channelId)).pipe(ignoreElements()),
      fromEvent<InstagramQuestEntity>(redis, 'message'),
    );
  }
}
