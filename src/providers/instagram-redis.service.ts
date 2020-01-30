import { Injectable } from '@nestjs/common';
import { Redis } from 'ioredis';
import { Observable } from 'rxjs';
import { IcLogger } from './logger';
import { RedisFactoryService } from './redis-factory.service';
import { map, filter } from 'rxjs/operators';
import { InstagramQuest, AuthzClientId } from '../interfaces';
import * as uuid from 'uuid-random';
import { subscribeToEvents, subscribeToEventsPattern } from './redis-service';
import { ValidateQuestSubmitResult } from '../interfaces/instagram-quest';

const REDIS_HOUR = 60 * 60;

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

  static createQuestIdToCampaignIdKey(questId: string) {
    return `questId:${questId}:campaignId`;
  }

  static createUserQuestsKey(user: AuthzClientId, questId: string) {
    return `hero:${user.azp}:quest:${questId}`;
  }

  static createSubscriptionSentQuestsCountKey(subscriptionId: string) {
    return `subcription:${subscriptionId}:sent_quests`;
  }

  static createAssignedQuestsCountKey(subscriptionId: string) {
    return `subcription:${subscriptionId}:assigned_count`;
  }

  async publishCampaignQuest(
    campaignId: number,
    quest: Omit<InstagramQuest, 'questId'>,
  ) {
    this.logger.debug(
      `publishCampaignQuest ${campaignId} ${JSON.stringify(quest)}`,
    );
    const questId = uuid();
    await this.redis
      .pipeline()
      .set(
        InstagramRedisService.createWaitingForAssignKey(questId),
        JSON.stringify(quest),
        'EX',
        quest.expireDurationSeconds,
      )
      .set(
        InstagramRedisService.createQuestIdToCampaignIdKey(questId),
        campaignId,
        'EX',
        quest.expireDurationSeconds * 2,
      )
      .exec();
    return this.redis.publish(
      InstagramRedisService.createCampaignQuestsChannelName(campaignId),
      JSON.stringify({ questId, ...quest }),
    );
  }

  getInstagramQuests(campaignId: number): Observable<string[]> {
    this.logger.debug(`getInstagramQuests ${campaignId}`);
    const channelId = InstagramRedisService.createCampaignQuestsChannelName(
      campaignId,
    );
    return subscribeToEvents(this.factory, channelId);
  }

  async incSubscriptionSentQuestsCount(subscriptionId: string) {
    const key = InstagramRedisService.createSubscriptionSentQuestsCountKey(
      subscriptionId,
    );
    const old = await this.redis.incr(key);
    await this.redis.expire(key, REDIS_HOUR * 24);
    return old;
  }
  async getSubscriptionSentQuestsCount(subscriptionId: string) {
    return this.redis
      .get(
        InstagramRedisService.createSubscriptionSentQuestsCountKey(
          subscriptionId,
        ),
      )
      .then(countString => +countString!!);
  }

  getUnassignedQuestKeys(): Observable<string> {
    this.logger.debug('getUnassignedQuestKeys');
    return this.expired$.pipe(
      filter(_ => _.endsWith(':wfa')),
      map(_ => _.split(':')[1]),
    );
  }

  async validateQuestSubmit(questId: string) {
    const expirationKey = InstagramRedisService.createWaitingForCompleteKey(
      questId,
    );
    const isWaiting = await this.redis.get(expirationKey);
    if (!isWaiting) {
      this.logger.debug(`validateQuestSubmit ${questId} expired`);
      return ValidateQuestSubmitResult.Expired;
    }
    this.logger.debug(`validateQuestSubmit ${questId} ok`);
    await this.redis.del(expirationKey);
    return ValidateQuestSubmitResult.Ok;
  }

  async getQuestCampaignId(questId: string) {
    return this.redis
      .get(InstagramRedisService.createQuestIdToCampaignIdKey(questId))
      .then(idString => (idString ? +idString : null));
  }

  async assignQuest(
    questId: string,
    subscriptionId: string,
    user: AuthzClientId,
  ) {
    const assignWaitingKey = InstagramRedisService.createWaitingForAssignKey(
      questId,
    );
    const isCompletedKey = InstagramRedisService.createWaitingForCompleteKey(
      questId,
    );
    const assignedQuestsCountKey = InstagramRedisService.createAssignedQuestsCountKey(
      subscriptionId,
    );
    const isCompleted = await this.redis
      .get(isCompletedKey)
      .then(flag => flag === '1');
    if (isCompleted) {
      throw new Error('quest is completed');
    }
    const questString = await this.redis.get(assignWaitingKey);
    if (!questString) {
      throw new Error('quest does not exists');
    }
    const isAssigned = await this.isQuestOwner(user, questId);
    if (isAssigned) {
      throw new Error('quest already assigned');
    }
    const quest = JSON.parse(questString) as InstagramQuest;
    await this.redis
      .pipeline()
      .del(assignWaitingKey)
      .incr(assignedQuestsCountKey)
      .expire(assignedQuestsCountKey, REDIS_HOUR * 24)
      .set(
        InstagramRedisService.createUserQuestsKey(user, questId),
        '1',
        'EX',
        quest.expireDurationSeconds,
      )
      .set(isCompletedKey, '0', 'EX', quest.expireDurationSeconds)
      .exec();
  }

  async isQuestOwner(user: AuthzClientId, questId: string) {
    return this.redis
      .get(InstagramRedisService.createUserQuestsKey(user, questId))
      .then(flag => flag === '1');
  }

  getSubscriptionAssignedQuestsCount(subscriptionId: string) {
    return this.redis
      .get(InstagramRedisService.createAssignedQuestsCountKey(subscriptionId))
      .then(countString => +countString!!);
  }

  async cleanupSubscriptionData(subscriptionId: string) {
    return this.redis
      .pipeline()
      .del(
        InstagramRedisService.createSubscriptionSentQuestsCountKey(
          subscriptionId,
        ),
      )
      .del(InstagramRedisService.createAssignedQuestsCountKey(subscriptionId))
      .exec();
  }
}
