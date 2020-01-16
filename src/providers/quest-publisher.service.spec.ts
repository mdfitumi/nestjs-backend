import { Test, TestingModule } from '@nestjs/testing';
import { QuestPublisherService } from './quest-publisher.service';

describe('NchanService', () => {
  let service: QuestPublisherService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [QuestPublisherService],
    }).compile();

    service = module.get<QuestPublisherService>(QuestPublisherService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
