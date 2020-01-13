import { Injectable, OnModuleInit } from '@nestjs/common';
import { InstagramStorageService } from './instagram-storage.service';

@Injectable()
export class SchedulerService implements OnModuleInit {
  private readonly SCHEDULER_TICK_INTERVAL = 60000;
  private readonly WORKER_ID = 1;
  constructor(private readonly instagramStorage: InstagramStorageService) {}
  onModuleInit() {
    this.tick();
  }

  async tick() {
    const campaigns = await this.instagramStorage.getActiveCampaigns(
      this.WORKER_ID,
    );
    if (campaigns.length > 0) {
      console.log(`Got ${campaigns.length} active campaigns`);
    }
    setTimeout(() => this.tick(), this.SCHEDULER_TICK_INTERVAL);
  }
}
