import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CargoException } from 'src/models/cargo.exception';
import { CargoReturenCode } from 'src/models/cargo.model';
import { ScooterService } from 'src/scooter/scooter.service';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { IsNull, Repository } from 'typeorm';
import { CreateRentDto } from './dto/create-rent.dto';
import { UpdateRentDto } from './dto/update-rent.dto';
import { UserRentDto } from './dto/user-rent.dto';
import { Rent } from './entities/rent.entity';

@Injectable()
export class RentService {
  constructor(
    private userService: UserService,
    private scooterService: ScooterService,
    @InjectRepository(Rent)
    private rentRepository: Repository<Rent>,
  ) {}

  async rent(dto: UserRentDto, user: User) {
    const scooter = await this.scooterService.findOne(dto.idScooters);

    if (!user || !scooter)
      throw new CargoException(CargoReturenCode.UNKNOWN_ERROR);

    const existRent = await this.rentRepository.findOne({
      where: { idUsers: user.idUsers, endDate: IsNull() },
    });

    if (existRent) throw new CargoException(CargoReturenCode.USER_RENTED);

    const existScooter = await this.rentRepository.findOne({
      where: { idScooters: scooter.idScooters, endDate: IsNull() },
    });

    if (existScooter) throw new CargoException(CargoReturenCode.SCOOTER_RENTED);

    const rent = this.rentRepository.create(dto);

    rent.idUsers = user.idUsers;
    rent.startDate = new Date();
    rent.addIdUsers = user.idUsers;

    return this.rentRepository.save(rent);
  }

  findAll(idUsers: number) {
    return this.rentRepository.find({ where: { idUsers } });
  }

  async drop(idRents: number, user: User) {
    const rent = await this.rentRepository.findOne({ where: { idRents } });
    rent.endDate = new Date();
    rent.updIdUsers = user.idUsers;
    return this.rentRepository.save(rent);
  }
}
