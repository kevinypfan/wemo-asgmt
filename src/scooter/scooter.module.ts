import { Module } from '@nestjs/common';
import { ScooterService } from './scooter.service';
import { ScooterController } from './scooter.controller';
import { Scooter } from './entities/scooter.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminScooterService } from './admin-scooter.service';
import { AdminScooterController } from './admin-scooter.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Scooter])],
  controllers: [ScooterController, AdminScooterController],
  providers: [ScooterService, AdminScooterService],
  exports: [ScooterService, AdminScooterService],
})
export class ScooterModule {}
