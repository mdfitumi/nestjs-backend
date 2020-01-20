import { Injectable } from '@nestjs/common';
import { Redis, RedisOptions } from 'ioredis';
import { Observable, fromEvent, concat, defer } from 'rxjs';
import { IcLogger } from './logger';
import { RedisFactoryService } from './redis-factory.service';
import { ignoreElements } from 'rxjs/operators';
import { parse } from 'url';
import { InstagramQuest } from '../interfaces';

@Injectable()
export class RedisService {
  private readonly redis: Redis;
  constructor(
    private readonly factory: RedisFactoryService,
    private readonly logger: IcLogger,
  ) {
    this.redis = this.factory.create();
    this.logger.setContext('RedisService');
  }

  public static parseOptions(options: string): RedisOptions {
    const redisOptions = parse(options);
    let redisPass: string = '';
    if (redisOptions.auth) {
      redisPass = redisOptions.auth.split(':')[1];
    }

    return {
      host: redisOptions.hostname!!,
      port: Number(redisOptions.port),
      password: redisPass,
    };
  }

  static createCampaignChannelName(campaignId: number) {
    return `channel:${campaignId}`;
  }

  static createCampaignQuestsChannelName(campaignId: number) {
    return `campaign_quests:${campaignId}`;
  }

  publishCampaignQuest(campaignId: number, quest: InstagramQuest) {
    this.logger.debug(
      `publishCampaignQuest ${campaignId} ${JSON.stringify(quest)}`,
    );
    return this.redis.publish(
      RedisService.createCampaignQuestsChannelName(campaignId),
      JSON.stringify(quest),
    );
  }

  getInstagramQuests(campaignId: number): Observable<InstagramQuest> {
    this.logger.debug(`getInstagramQuests ${campaignId}`);
    const channelId = RedisService.createCampaignQuestsChannelName(campaignId);
    const redis = this.factory.create();
    return concat(
      defer(() => redis.subscribe(channelId)).pipe(ignoreElements()),
      fromEvent<InstagramQuest>(redis, 'message'),
    );
  }
}
