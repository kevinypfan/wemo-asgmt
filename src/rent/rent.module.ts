import { Module } from '@nestjs/common';
import { RentService } from './rent.service';
import { RentController } from './rent.controller';
import { Rent } from './entities/rent.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from 'src/user/user.module';
import { ScooterModule } from 'src/scooter/scooter.module';

@Module({
  imports: [TypeOrmModule.forFeature([Rent]), UserModule, ScooterModule],
  controllers: [RentController],
  providers: [RentService],
})
export class RentModule {}
