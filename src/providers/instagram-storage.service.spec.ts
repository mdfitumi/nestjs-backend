import { Test, TestingModule } from '@nestjs/testing';
import { InstagramStorageService } from './instagram-storage.service';

describe('InstagramStorageService', () => {
  let service: InstagramStorageService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [InstagramStorageService],
    }).compile();

    service = module.get<InstagramStorageService>(InstagramStorageService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
