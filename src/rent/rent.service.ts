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
import { Rent } from './entities/rent.entity';

@Injectable()
export class RentService {
  constructor(
    private userService: UserService,
    private scooterService: ScooterService,
    @InjectRepository(Rent)
    private rentRepository: Repository<Rent>,
  ) {}

  async create(createRentDto: CreateRentDto, user: User) {
    const scooter = await this.scooterService.findOne(createRentDto.idScooters);

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

    const rent = this.rentRepository.create(createRentDto);

    rent.idUsers = user.idUsers;
    rent.startDate = new Date();

    return this.rentRepository.save(rent);
  }

  boFindAll() {
    return this.rentRepository.find();
  }

  userFindAll(idUsers: number) {
    return this.rentRepository.find({ where: { idUsers } });
  }

  findOne(id: number) {
    return this.rentRepository.findOne({ where: { idUsers: id } });
  }

  update(id: number, updateRentDto: UpdateRentDto) {
    return this.rentRepository.update(id, updateRentDto);
  }

  async dropOff(idRents: number) {
    const rent = await this.rentRepository.findOne({ where: { idRents } });
    rent.endDate = new Date();
    return this.rentRepository.save(rent);
  }
}
