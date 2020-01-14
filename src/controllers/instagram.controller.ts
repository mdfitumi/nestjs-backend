import { Controller, Post, Body, Delete, Get, Param } from '@nestjs/common';
import { InstagramStorageService } from '../providers';
import {
  CreateInstagramDto,
  CreateInstagramCampaignDto,
  PublishInstagramCampaignQuestDto,
} from '../dto';

@Controller('instagram')
export class InstagramController {
  constructor(private readonly instagramService: InstagramStorageService) {}

  @Post()
  async createAccount(@Body() account: CreateInstagramDto) {
    return this.instagramService.addAccount(account);
  }

  @Delete()
  async deleteAccount(@Body() accountId: number) {
    return this.instagramService.deleteAccount({ id: accountId });
  }

  @Post('/campaign')
  async createCampaign(@Body() campaign: CreateInstagramCampaignDto) {
    return this.instagramService.addCampaign(campaign);
  }

  @Post('/campaign/quest')
  async publishCampaignQuest(@Body() req: PublishInstagramCampaignQuestDto) {
    console.log('publishCampaignQuest');
    return this.instagramService.publishCampaignQuest(
      req.campaignId,
      req.quest,
    );
  }

  @Get('/campaign/:id')
  async showCampaign(@Param('id') campaignId: number) {
    return this.instagramService.getCampaign(campaignId);
  }

  @Get('/validate-campaign-subscription')
  // tslint:disable-next-line: no-empty
  validateCampaignSubscription() {
    console.log('validateCampaignSubscription');
    return '';
  }
}
