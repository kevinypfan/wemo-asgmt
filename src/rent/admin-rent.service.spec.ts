import { Test, TestingModule } from '@nestjs/testing';
import { AdminRentService } from './admin-rent.service';

describe('AdminRentService', () => {
  let service: AdminRentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AdminRentService],
    }).compile();

    service = module.get<AdminRentService>(AdminRentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
