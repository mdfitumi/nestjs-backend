import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WsResponse,
} from '@nestjs/websockets';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { IcLogger } from './logger';
import { RedisService } from './redis.service';
import { InstagramQuestEntity } from 'src/entities/instagram-quest.entity';
import { CampaignQuestsDto } from '../dto/campaign-quests.dto';

const QUESTS_EVENT_NAME = 'quests';

@WebSocketGateway()
export class InstagramQuestsService {
  constructor(
    private readonly redis: RedisService,
    private readonly logger: IcLogger,
  ) {
    this.logger.setContext('InstagramQuestsService');
  }

  @SubscribeMessage(QUESTS_EVENT_NAME)
  onEvent(
    @MessageBody() msg: CampaignQuestsDto,
  ): Observable<WsResponse<InstagramQuestEntity>> {
    const channelId = RedisService.createCampaignQuestsChannelName(
      msg.campaignId,
    );
    this.logger.debug(`onEvent quests ${channelId}`);
    return this.redis
      .getInstagramQuests(msg.campaignId)
      .pipe(map(quest => ({ event: QUESTS_EVENT_NAME, data: quest })));
  }
}
