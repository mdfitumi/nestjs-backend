import {
  Controller,
  Post,
  Body,
  Delete,
  Get,
  Param,
  UseGuards,
  Req,
} from '@nestjs/common';
import { InstagramStorageService, InstagramRedisService } from '../providers';
import { IcLogger } from '../providers/logger';
import {
  CreateInstagramDto,
  CreateInstagramCampaignDto,
  PublishInstagramCampaignQuestDto,
  SubmitQuestDto,
} from '../dto';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { AuthzJwtPayload } from '../interfaces/authz-jwt-payload';
import { InstagramQuestAssignDto } from '../dto/instagram-quest-assign.dto';

@UseGuards(AuthGuard('jwt'))
@Controller('instagram')
export class InstagramController {
  constructor(
    private readonly instagramService: InstagramStorageService,
    private readonly redis: InstagramRedisService,
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

  @Post('/campaign/quest/assign')
  async campaignQuestAssign(@Req() req: Request) {
    this.logger.debug('campaignQuestAssign');
    const body = req.body as InstagramQuestAssignDto;
    const user = req.user as AuthzJwtPayload;
    await this.redis.assignQuest(body.questId, user);
  }

  @Post('/campaign/quest/complete')
  async campaignQuestComplete(@Req() req: Request) {
    this.logger.debug('campaignQuestComplete');
    const body = req.body as SubmitQuestDto;
    const user = req.user as AuthzJwtPayload;
    const isQuestOwner = await this.redis.isQuestOwner(user, body.questId);
    if (isQuestOwner) {
      return this.redis.validateQuestSubmit(body.questId);
    }
    throw new Error('not quest owner');
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
