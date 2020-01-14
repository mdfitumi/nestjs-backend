import { Test, TestingModule } from '@nestjs/testing';
import { NchanService } from './nchan.service';

describe('NchanService', () => {
  let service: NchanService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NchanService],
    }).compile();

    service = module.get<NchanService>(NchanService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
