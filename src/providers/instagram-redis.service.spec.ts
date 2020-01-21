import { Test, TestingModule } from '@nestjs/testing';
import { InstagramRedisService } from './instagram-redis.service';

describe('RedisService', () => {
  let service: InstagramRedisService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [InstagramRedisService],
    }).compile();

    service = module.get<InstagramRedisService>(InstagramRedisService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
