import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  InstagramEntity,
  InstagramCampaignEntity,
  InstagramQuestTypeEntity,
} from 'src/entities';
import { Repository } from 'typeorm';
import { CreateInstagramDto } from '../dto';

@Injectable()
export class InstagramStorageService {
  constructor(
    @InjectRepository(InstagramEntity)
    private instagramRepo: Repository<InstagramEntity>,
    @InjectRepository(InstagramCampaignEntity)
    private instagramCampaignRepo: Repository<InstagramCampaignEntity>,
    @InjectRepository(InstagramQuestTypeEntity)
    private instagramQuestTypeRepo: Repository<InstagramQuestTypeEntity>,
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
}
