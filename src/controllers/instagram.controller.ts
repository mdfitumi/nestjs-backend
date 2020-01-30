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
import { omit } from 'lodash';
import {
  InstagramStorageService,
  InstagramRedisService,
  PublicStorageService,
} from '../providers';
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
import { ValidateQuestSubmitResult } from 'src/interfaces';

@UseGuards(AuthGuard('jwt'))
@Controller('instagram')
export class InstagramController {
  constructor(
    private readonly instagramStorage: InstagramStorageService,
    private readonly publicStorage: PublicStorageService,
    private readonly redis: InstagramRedisService,
    private readonly logger: IcLogger,
  ) {
    this.logger.setContext('InstagramController');
  }

  @Post()
  async createAccount(@Body() account: CreateInstagramDto) {
    this.logger.debug('createAccount');
    return this.instagramStorage.addAccount(account);
  }

  @Delete()
  async deleteAccount(@Body() accountId: number) {
    this.logger.debug('deleteAccount');
    return this.instagramStorage.deleteAccount({ id: accountId });
  }

  @Post('/campaign')
  async createCampaign(@Body() campaign: CreateInstagramCampaignDto) {
    this.logger.debug('createCampaign');
    return this.instagramStorage.addCampaign(campaign);
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
    await this.redis.assignQuest(body.questId, body.subscriptionId!!, user);
  }

  @Post('/campaign/quest/complete')
  async campaignQuestComplete(@Req() req: Request) {
    const body = req.body as SubmitQuestDto;
    const user = req.user as AuthzJwtPayload;
    this.logger.debug(`campaignQuestComplete`);
    const isQuestOwner = await this.redis.isQuestOwner(user, body.questId);
    if (isQuestOwner) {
      const [campaignId, submitResult] = await Promise.all([
        this.redis.getQuestCampaignId(body.questId),
        this.redis.validateQuestSubmit(body.questId),
      ]);
      this.logger.debug(
        `campaignQuestComplete campaignId ${campaignId} submitResult ${submitResult}`,
      );
      switch (submitResult) {
        case ValidateQuestSubmitResult.Ok:
          const publicUser = await this.publicStorage.getAccountByAuthzId(
            user.azp,
          );
          this.logger.debug(`campaignQuestComplete userId ${publicUser?.id}`);
          return this.instagramStorage
            .saveCompletedQuest(publicUser!!.id, campaignId!!)
            .then(completedQuest => ({
              status: 'ok',
              data: omit(completedQuest, ['id']),
            }));
        case ValidateQuestSubmitResult.Expired:
          return { status: 'err', message: 'quest expired' };
      }
    }
    return { status: 'err', message: 'not quest owner' };
  }

  @Get('/campaign/:id')
  async showCampaign(@Param('id') campaignId: number) {
    this.logger.debug('showCampaign');
    return this.instagramStorage.getCampaign(campaignId);
  }

  @Get('/validate-campaign-subscription')
  // tslint:disable-next-line: no-empty
  validateCampaignSubscription() {
    this.logger.debug('validateCampaignSubscription');
    return '';
  }
}
