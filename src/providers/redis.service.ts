import { Injectable } from '@nestjs/common';
import { Redis, RedisOptions } from 'ioredis';
import { Observable, fromEvent, concat, defer } from 'rxjs';
import { IcLogger } from './logger';
import { RedisFactoryService } from './redis-factory.service';
import { ignoreElements } from 'rxjs/operators';
import { parse } from 'url';
import { InstagramQuest, AuthzClientId } from '../interfaces';
import * as uuid from 'uuid-random';

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

  static createQuestExpirationKey(questId: string) {
    return `quest:${questId}:waiting`;
  }

  static createUserQuestsKey(user: AuthzClientId, questId: string) {
    return `hero:${user.azp}:quest:${questId}`;
  }

  async publishCampaignQuest(campaignId: number, quest: InstagramQuest) {
    this.logger.debug(
      `publishCampaignQuest ${campaignId} ${JSON.stringify(quest)}`,
    );
    const questId = uuid();
    await this.redis.set(
      RedisService.createQuestExpirationKey(questId),
      JSON.stringify(quest),
      'EX',
      quest.expireDurationSeconds,
    );
    return this.redis.publish(
      RedisService.createCampaignQuestsChannelName(campaignId),
      JSON.stringify({ questId, ...quest }),
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

  async validateQuestSubmit(questId: string) {
    const expirationKey = RedisService.createQuestExpirationKey(questId);
    const isWaiting = await this.redis.get(expirationKey);
    if (!isWaiting) {
      this.logger.debug(`validateQuestSubmit ${questId} expired`);
      return 'expired';
    }
    this.logger.debug(`validateQuestSubmit ${questId} ok`);
    await this.redis.del(expirationKey);
    return 'ok';
  }

  async assignQuest(questId: string, user: AuthzClientId) {
    const questString = await this.redis.get(
      RedisService.createQuestExpirationKey(questId),
    );
    if (!questString) {
      throw new Error('quest does not exists');
    }
    const isAssigned = await this.isQuestOwner(user, questId);
    if (isAssigned) {
      throw new Error('quest already assigned');
    }
    const quest = JSON.parse(questString) as InstagramQuest;
    return this.redis.set(
      RedisService.createUserQuestsKey(user, questId),
      '1',
      'EX',
      quest.expireDurationSeconds,
    );
  }

  async isQuestOwner(user: AuthzClientId, questId: string) {
    return this.redis
      .get(RedisService.createUserQuestsKey(user, questId))
      .then(flag => flag === '1');
  }
}
