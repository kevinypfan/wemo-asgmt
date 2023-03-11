import { Module } from '@nestjs/common';
import { ScooterService } from './scooter.service';
import { ScooterController } from './scooter.controller';
import { Scooter } from './entities/scooter.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Scooter])],
  controllers: [ScooterController],
  providers: [ScooterService],
})
export class ScooterModule {}
