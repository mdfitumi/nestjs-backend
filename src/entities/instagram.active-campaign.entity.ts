import { Entity } from 'typeorm';
import { InstagramCampaignEntity } from './instagram.campaign.entity';

@Entity({
  name: 'instagram.active_campaigns',
})
export class InstagramActiveCampaignEntity extends InstagramCampaignEntity {}
