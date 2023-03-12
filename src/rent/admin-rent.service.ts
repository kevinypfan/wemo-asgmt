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
export class AdminRentService {
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

    const rent = await this.rentRepository.create(createRentDto);

    rent.addIdUsers = user.idUsers;

    return this.rentRepository.save(rent);
  }

  findAll() {
    return this.rentRepository.find();
  }

  findOne(id: number) {
    return this.rentRepository.findOne({ where: { idRents: id } });
  }

  update(id: number, updateRentDto: UpdateRentDto, user: User) {
    return this.rentRepository.update(id, {
      ...updateRentDto,
      updIdUsers: user.idUsers,
    });
  }

  remove(id: number) {
    this.rentRepository.delete(id);
  }
}
