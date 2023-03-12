import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CargoException } from 'src/models/cargo.exception';
import { Cargo, CargoReturenCode } from 'src/models/cargo.model';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateScooterDto } from './dto/create-scooter.dto';
import { UpdateScooterDto } from './dto/update-scooter.dto';
import { Scooter } from './entities/scooter.entity';

@Injectable()
export class ScooterService {
  constructor(
    @InjectRepository(Scooter)
    private scooterRepository: Repository<Scooter>,
  ) {}

  create(createScooterDto: CreateScooterDto, user: User) {
    const scooter = this.scooterRepository.create(createScooterDto);
    scooter.addIdUsers = user.idUsers;
    return this.scooterRepository.save(scooter);
  }

  findAll() {
    return this.scooterRepository.find();
  }

  async findOne(id: number) {
    const scooter = await this.scooterRepository.findOne({
      where: { idScooters: id },
    });
    if (!scooter) throw new CargoException(CargoReturenCode.NOT_FOUND);
    return scooter;
  }

  async update(id: number, updateScooterDto: UpdateScooterDto, user: User) {
    await this.scooterRepository.update(id, {
      ...updateScooterDto,
      updIdUsers: user.idUsers,
    });
    return this.findOne(id);
  }

  remove(id: number) {
    this.scooterRepository.delete(id);
  }
}
