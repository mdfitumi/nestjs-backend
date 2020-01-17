import { Controller, Post, Body, Delete, Get, Param } from '@nestjs/common';
import { InstagramStorageService } from '../providers';
import { IcLogger } from '../providers/logger';
import { RedisService } from '../providers/redis.service';
import {
  CreateInstagramDto,
  CreateInstagramCampaignDto,
  PublishInstagramCampaignQuestDto,
} from '../dto';

@Controller('instagram')
export class InstagramController {
  constructor(
    private readonly instagramService: InstagramStorageService,
    private readonly redis: RedisService,
    private readonly logger: IcLogger,
  ) {
    this.logger.setContext('InstagramController');
  }

  @Post()
  async createAccount(@Body() account: CreateInstagramDto) {
    this.logger.debug('createAccount');
    return this.instagramService.addAccount(account);
  }

  @Delete()
  async deleteAccount(@Body() accountId: number) {
    this.logger.debug('deleteAccount');
    return this.instagramService.deleteAccount({ id: accountId });
  }

  @Post('/campaign')
  async createCampaign(@Body() campaign: CreateInstagramCampaignDto) {
    this.logger.debug('createCampaign');
    return this.instagramService.addCampaign(campaign);
  }

  @Post('/campaign/quest')
  async publishCampaignQuest(@Body() req: PublishInstagramCampaignQuestDto) {
    this.logger.debug('publishCampaignQuest');
    return this.redis.publishCampaignQuest(req.campaignId, req.quest);
  }

  @Get('/campaign/:id')
  async showCampaign(@Param('id') campaignId: number) {
    this.logger.debug('showCampaign');
    return this.instagramService.getCampaign(campaignId);
  }

  @Get('/validate-campaign-subscription')
  // tslint:disable-next-line: no-empty
  validateCampaignSubscription() {
    this.logger.debug('validateCampaignSubscription');
    return '';
  }
}
