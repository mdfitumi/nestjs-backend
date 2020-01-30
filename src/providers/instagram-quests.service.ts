import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WsResponse,
} from '@nestjs/websockets';
import {
  map,
  tap,
  scan,
  filter,
  mapTo,
  mergeMap,
  takeUntil,
  finalize,
} from 'rxjs/operators';
import { Observable, timer, merge, from, concat, of } from 'rxjs';
import * as uuid from 'uuid-random';
import { IcLogger } from './logger';
import { InstagramRedisService } from './instagram-redis.service';
import { CampaignQuestsDto } from '../dto/campaign-quests.dto';
import { SchedulerService } from './scheduler.service';

const QUESTS_EVENT_NAME = 'quests';

@WebSocketGateway()
export class InstagramQuestsService {
  private readonly UNASSIGNED_QUESTS_LIMIT = 3;
  constructor(
    private readonly redis: InstagramRedisService,
    private readonly logger: IcLogger,
  ) {
    this.logger.setContext('InstagramQuestsService');
  }

  @SubscribeMessage(QUESTS_EVENT_NAME)
  onCampaignQuestSubscription(
    @MessageBody() msg: CampaignQuestsDto,
  ): Observable<WsResponse<any>> {
    this.logger.debug(`onCampaignQuestSubscription ${msg.campaignId}`);
    const subscriptionId = uuid();
    const stop$ = merge(
      this.redis.getUnassignedQuestKeys().pipe(
        scan((acc, _) => acc + 1, 0),
        filter(_ => _ > this.UNASSIGNED_QUESTS_LIMIT),
        mapTo(true),
      ),
      timer(SchedulerService.SCHEDULER_TICK_INTERVAL, 15000).pipe(
        mergeMap(_ =>
          from(
            Promise.all([
              this.redis.getSubscriptionSentQuestsCount(subscriptionId),
              this.redis.getSubscriptionAssignedQuestsCount(subscriptionId),
            ]),
          ),
        ),
        filter(
          ([sentCount, assignedCount]) =>
            sentCount - assignedCount > this.UNASSIGNED_QUESTS_LIMIT,
        ),
        mapTo(true),
      ),
    );
    return concat(
      this.redis.getInstagramQuests(msg.campaignId).pipe(
        map(quest => {
          process.nextTick(async () => {
            await this.redis.incSubscriptionSentQuestsCount(subscriptionId);
          });
          return {
            event: QUESTS_EVENT_NAME,
            data: [...quest, subscriptionId],
          };
        }),
        takeUntil(stop$),
        finalize(
          async () => await this.redis.cleanupSubscriptionData(subscriptionId),
        ),
      ),
      of({ event: QUESTS_EVENT_NAME, data: 'end' }),
    );
  }
}
