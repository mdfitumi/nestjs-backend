import {
  Controller,
  Post,
  Body,
  Delete,
  Get,
  Param,
  UseGuards,
} from '@nestjs/common';
import { InstagramStorageService, RedisService } from '../providers';
import { IcLogger } from '../providers/logger';
import {
  CreateInstagramDto,
  CreateInstagramCampaignDto,
  PublishInstagramCampaignQuestDto,
  SubmitQuestDto,
} from '../dto';
import { AuthGuard } from '@nestjs/passport';

@UseGuards(AuthGuard('jwt'))
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

  @Post('/campaign/quest/complete')
  async campaignQuestComplete(@Body() req: SubmitQuestDto) {
    this.logger.debug('campaignQuestComplete');
    return this.redis.validateQuestSubmit(req.questId);
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
