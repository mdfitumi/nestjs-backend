import { Injectable } from '@nestjs/common';
import { Redis } from 'ioredis';
import { Observable } from 'rxjs';
import { IcLogger } from './logger';
import { RedisFactoryService } from './redis-factory.service';
import { map, filter } from 'rxjs/operators';
import { InstagramQuest, AuthzClientId } from '../interfaces';
import * as uuid from 'uuid-random';
import { subscribeToEvents, subscribeToEventsPattern } from './redis-service';

@Injectable()
export class InstagramRedisService {
  private readonly redis: Redis;
  private readonly expired$ = subscribeToEvents<string[]>(
    this.factory,
    '__keyevent@0__:expired',
  ).pipe(map(_ => _[1]));
  constructor(
    private readonly factory: RedisFactoryService,
    private readonly logger: IcLogger,
  ) {
    this.redis = this.factory.create();
    this.logger.setContext('InstagramRedisService');
  }

  static createCampaignChannelName(campaignId: number) {
    return `channel:${campaignId}`;
  }

  static createCampaignQuestsChannelName(campaignId: number) {
    return `campaign_quests:${campaignId}`;
  }

  static createWaitingForAssignKey(questId: string) {
    return `quest:${questId}:wfa`;
  }

  static createWaitingForCompleteKey(questId: string) {
    return `quest:${questId}:wfc`;
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
      InstagramRedisService.createWaitingForAssignKey(questId),
      JSON.stringify(quest),
      'EX',
      quest.expireDurationSeconds,
    );
    return this.redis.publish(
      InstagramRedisService.createCampaignQuestsChannelName(campaignId),
      JSON.stringify({ questId, ...quest }),
    );
  }

  getInstagramQuests(campaignId: number): Observable<InstagramQuest> {
    this.logger.debug(`getInstagramQuests ${campaignId}`);
    const channelId = InstagramRedisService.createCampaignQuestsChannelName(
      campaignId,
    );
    return subscribeToEvents(this.factory, channelId);
  }

  getUnassignedQuestKeys(): Observable<string> {
    this.logger.debug('getUnassignedQuestKeys');
    return this.expired$.pipe(
      filter(_ => _.endsWith(':wfa')),
      map(_ => _.split(':')[1]),
    );
  }

  async validateQuestSubmit(questId: string) {
    const expirationKey = InstagramRedisService.createWaitingForAssignKey(
      questId,
    );
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
    const assignWaitingKey = InstagramRedisService.createWaitingForAssignKey(
      questId,
    );
    const questString = await this.redis.get(assignWaitingKey);
    if (!questString) {
      throw new Error('quest does not exists');
    }
    const isAssigned = await this.isQuestOwner(user, questId);
    if (isAssigned) {
      throw new Error('quest already assigned');
    }
    await this.redis.del(assignWaitingKey);
    const quest = JSON.parse(questString) as InstagramQuest;
    return this.redis.set(
      InstagramRedisService.createUserQuestsKey(user, questId),
      '1',
      'EX',
      quest.expireDurationSeconds,
    );
  }

  async isQuestOwner(user: AuthzClientId, questId: string) {
    return this.redis
      .get(InstagramRedisService.createUserQuestsKey(user, questId))
      .then(flag => flag === '1');
  }
}
