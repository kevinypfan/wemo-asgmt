import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CargoException } from '../models/cargo.exception';
import { Cargo, CargoReturenCode } from '../models/cargo.model';
import { PageRequest } from '../models/page-request';
import { PageResponse } from '../models/page-response';
import { User } from '../user/entities/user.entity';
import { camelToSnake } from '../utils/helpers';
import { DataSource, Repository } from 'typeorm';
import { CreateScooterDto } from './dto/create-scooter.dto';
import { FilterScooterDto } from './dto/filter-scooter.dto';
import { UpdateScooterDto } from './dto/update-scooter.dto';
import { Scooter } from './entities/scooter.entity';

@Injectable()
export class AdminScooterService {
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

  async findAll(pageRequest: PageRequest, filterObject: FilterScooterDto) {
    const query = this.dataSource
      .getRepository(Scooter)
      .createQueryBuilder('scooter');

    if (filterObject.canRent) {
      query.andWhere(
        '(select count(*) from core_rents where core_rents.id_scooters = scooter.id_scooters and core_rents.end_date is null) = 0',
      );
    }

    if (filterObject.brand) {
      query.andWhere('scooter.brand ilike :brand', {
        brand: `%${filterObject.brand}%`,
      });
    }

    if (filterObject.licensePlate) {
      query.andWhere('scooter.licensePlate ilike :licensePlate', {
        licensePlate: `%${filterObject.licensePlate}%`,
      });
    }

    const order = pageRequest.order;

    Object.keys(order).forEach((key) => {
      const snakeKey = camelToSnake(key);
      query.addOrderBy(snakeKey, order[key]);
    });

    query.take(pageRequest.take);
    query.skip(pageRequest.skip);

    const [scooters, count] = await query.getManyAndCount();

    return new PageResponse(scooters, count, pageRequest);
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
