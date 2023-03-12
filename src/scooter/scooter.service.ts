import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CargoException } from 'src/models/cargo.exception';
import { Cargo, CargoReturenCode } from 'src/models/cargo.model';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateScooterDto } from './dto/create-scooter.dto';
import { UpdateScooterDto } from './dto/update-scooter.dto';
import { Scooter } from './entities/scooter.entity';
import { DataSource } from 'typeorm';

@Injectable()
export class ScooterService {
  constructor(
    private dataSource: DataSource,
    @InjectRepository(Scooter)
    private scooterRepository: Repository<Scooter>,
  ) {}

  create(createScooterDto: CreateScooterDto, user: User) {
    const scooter = this.scooterRepository.create(createScooterDto);
    scooter.addIdUsers = user.idUsers;
    return this.scooterRepository.save(scooter);
  }

  async findAll() {
    const scooters = await this.dataSource
      .getRepository(Scooter)
      .createQueryBuilder('scooter')
      .where(
        '(select count(*) from core_rents where core_rents.id_scooters = scooter.id_scooters and core_rents.end_date is null) = 0',
      )
      .getMany();

    return scooters;
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
