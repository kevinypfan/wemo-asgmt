import { Module } from '@nestjs/common';
import { RentService } from './rent.service';
import { RentController } from './rent.controller';
import { Rent } from './entities/rent.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from '../user/user.module';
import { ScooterModule } from '../scooter/scooter.module';
import { AdminRentService } from './admin-rent.service';
import { AdminRentController } from './admin-rent.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Rent]), UserModule, ScooterModule],
  controllers: [RentController, AdminRentController],
  providers: [RentService, AdminRentService],
})
export class RentModule {}
