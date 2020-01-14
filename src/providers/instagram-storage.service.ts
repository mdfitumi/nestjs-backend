import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InjectRedis } from '@mobizerg/nest-ioredis';
import { Redis } from 'ioredis';
import {
  InstagramEntity,
  InstagramCampaignEntity,
  InstagramQuestTypeEntity,
  InstagramActiveCampaignEntity,
} from 'src/entities';
import { Repository } from 'typeorm';
import { CreateInstagramDto, CreateInstagramCampaignDto } from '../dto';

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
    @InjectRedis()
    private redis: Redis,
  ) {}

  async addAccount(account: CreateInstagramDto) {
    const entity = this.instagramRepo.create(account);
    return this.instagramRepo.save(entity);
  }

  async deleteAccount(account: Partial<InstagramEntity>) {
    return this.instagramRepo.delete(account);
  }

  async getAccount(account: Partial<InstagramEntity>) {
    return this.instagramRepo.findOne(account);
  }

  async addCampaign(campaign: CreateInstagramCampaignDto) {
    const entity = this.instagramCampaignRepo.create({
      ...campaign,
      workerId: 1,
    });
    return this.instagramCampaignRepo.save(entity);
  }

  async getCampaign(campaignId: number) {
    return this.instagramCampaignRepo.findOne(campaignId);
  }

  async getActiveCampaigns(workerId: number) {
    return this.instagramActiveCampaignRepo.find({ workerId });
  }

  async publishCampaignQuest(campaignId: number, quest: string) {
    console.log(arguments);
    return await this.redis.publish(`channel:/campaign:${campaignId}`, quest);
  }
}
