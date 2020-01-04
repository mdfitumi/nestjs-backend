import { Controller, Post, Body } from '@nestjs/common';
import { InstagramStorageService } from '../providers';
import { CreateInstagramDto, CreateInstagramCampaignDto } from '../dto';

@Controller('instagram')
export class InstagramController {
  constructor(private readonly instagramService: InstagramStorageService) {}

  @Post()
  async createAccount(@Body() account: CreateInstagramDto) {
    return this.instagramService.addAccount(account);
  }

  @Post('/campaign')
  async createCampaign(@Body() campaign: CreateInstagramCampaignDto) {
    return this.instagramService.addCampaign(campaign);
  }
}
