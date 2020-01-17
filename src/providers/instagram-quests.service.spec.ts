import { Test, TestingModule } from '@nestjs/testing';
import { InstagramQuestsService } from './instagram-quests.service';

describe('InstagramQuestsService', () => {
  let service: InstagramQuestsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [InstagramQuestsService],
    }).compile();

    service = module.get<InstagramQuestsService>(InstagramQuestsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
