import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  InstagramEntity,
  InstagramCampaignEntity,
  InstagramQuestTypeEntity,
  InstagramActiveCampaignEntity,
} from 'src/entities';
import { Repository } from 'typeorm';
import { CreateInstagramDto, CreateInstagramCampaignDto } from '../dto';
import { IcLogger } from './logger';

@Injectable()
export class InstagramStorageService {
  constructor(
    @InjectRepository(InstagramEntity)
    private instagramRepo: Repository<InstagramEntity>,
    @InjectRepository(InstagramCampaignEntity)
    private instagramCampaignRepo: Repository<InstagramCampaignEntity>,
    @InjectRepository(InstagramActiveCampaignEntity)
    private instagramActiveCampaignRepo: Repository<
      InstagramActiveCampaignEntity
    >,
    @InjectRepository(InstagramQuestTypeEntity)
    private instagramQuestTypeRepo: Repository<InstagramQuestTypeEntity>,
    private readonly logger: IcLogger,
  ) {
    this.logger.setContext('InstagramStorageService');
  }

  async addAccount(account: CreateInstagramDto) {
    this.logger.debug(`addAccount ${JSON.stringify(account)}`);
    const entity = this.instagramRepo.create(account);
    return this.instagramRepo.save(entity);
  }

  async deleteAccount(account: Partial<InstagramEntity>) {
    this.logger.debug(`deleteAccount ${JSON.stringify(account)}`);
    return this.instagramRepo.delete(account);
  }

  async getAccount(account: Partial<InstagramEntity>) {
    this.logger.debug(`getAccount ${JSON.stringify(account)}`);
    return this.instagramRepo.findOne(account);
  }

  async addCampaign(campaign: CreateInstagramCampaignDto) {
    this.logger.debug(`addCampaign ${JSON.stringify(campaign)}`);
    const entity = this.instagramCampaignRepo.create({
      ...campaign,
      workerId: 1,
    });
    return this.instagramCampaignRepo.save(entity);
  }

  async getCampaign(campaignId: number) {
    this.logger.debug(`getCampaign ${campaignId.toString()}`);
    return this.instagramCampaignRepo.findOne(campaignId);
  }

  async getActiveCampaigns(workerId: number) {
    this.logger.debug(`getActiveCampaigns ${workerId.toString()}`);
    return this.instagramActiveCampaignRepo.find({ workerId });
  }
}
