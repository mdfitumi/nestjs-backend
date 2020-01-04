import { Test, TestingModule } from '@nestjs/testing';
import { InstagramController } from './instagram.controller';

describe('Instagram Controller', () => {
  let controller: InstagramController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InstagramController],
    }).compile();

    controller = module.get<InstagramController>(InstagramController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
