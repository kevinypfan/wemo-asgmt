import { Test, TestingModule } from '@nestjs/testing';
import { AdminRentController } from './admin-rent.controller';
import { RentService } from './rent.service';

describe('AdminRentController', () => {
  let controller: AdminRentController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdminRentController],
      providers: [RentService],
    }).compile();

    controller = module.get<AdminRentController>(AdminRentController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
