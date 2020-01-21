import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WsResponse,
} from '@nestjs/websockets';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { IcLogger } from './logger';
import { InstagramRedisService } from './instagram-redis.service';
import { InstagramQuest } from 'src/interfaces';
import { CampaignQuestsDto } from '../dto/campaign-quests.dto';

const QUESTS_EVENT_NAME = 'quests';

@WebSocketGateway()
export class InstagramQuestsService {
  constructor(
    private readonly redis: InstagramRedisService,
    private readonly logger: IcLogger,
  ) {
    this.logger.setContext('InstagramQuestsService');
  }

  @SubscribeMessage(QUESTS_EVENT_NAME)
  onCampaignQuestSubscription(
    @MessageBody() msg: CampaignQuestsDto,
  ): Observable<WsResponse<InstagramQuest>> {
    const channelId = InstagramRedisService.createCampaignQuestsChannelName(
      msg.campaignId,
    );
    this.logger.debug(`onCampaignQuestSubscription ${channelId}`);
    return this.redis
      .getInstagramQuests(msg.campaignId)
      .pipe(map(quest => ({ event: QUESTS_EVENT_NAME, data: quest })));
  }
}
