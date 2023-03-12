import { Test, TestingModule } from '@nestjs/testing';
import { AdminScooterService } from './admin-scooter.service';

describe('AdminScooterService', () => {
  let service: AdminScooterService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AdminScooterService],
    }).compile();

    service = module.get<AdminScooterService>(AdminScooterService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
