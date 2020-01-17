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

@WebSocketGateway()
export class InstagramQuestsService {
  constructor(
    private readonly redis: RedisService,
    private readonly logger: IcLogger,
  ) {
    this.logger.setContext('InstagramQuestsService');
  }

  @SubscribeMessage('quests')
  async onEvent(
    @MessageBody() msg: CampaignQuestsDto,
  ): Promise<Observable<WsResponse<InstagramQuestEntity>>> {
    const channelId = RedisService.createCampaignQuestsChannelName(
      msg.campaignId,
    );
    return this.redis
      .getInstagramQuests(msg.campaignId)
      .then(_ => _.pipe(map(quest => ({ event: channelId, data: quest }))));
  }
}
