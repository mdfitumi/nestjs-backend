import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class NchanService {
  publishCampaignQuest(campaignId: number, quest: string) {
    return axios.post(`http://nginx:8003/pub?campaignId=${campaignId}`, quest);
  }
}
