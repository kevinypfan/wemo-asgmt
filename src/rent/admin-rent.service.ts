import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CargoException } from '../models/cargo.exception';
import { CargoReturenCode } from '../models/cargo.model';
import { PageRequest } from '../models/page-request';
import { PageResponse } from '../models/page-response';
import { ScooterService } from '../scooter/scooter.service';
import { User } from '../user/entities/user.entity';
import { UserService } from '../user/user.service';
import { camelToSnake } from '../utils/helpers';
import { DataSource, IsNull, Repository } from 'typeorm';
import { CreateRentDto } from './dto/create-rent.dto';
import { FilterRentDto } from './dto/filter-rent.dto';
import { UpdateRentDto } from './dto/update-rent.dto';
import { Rent } from './entities/rent.entity';

@Injectable()
export class AdminRentService {
  constructor(
    private dataSource: DataSource,
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

  async findAll(pageRequest: PageRequest, filterObject: FilterRentDto) {
    const query = this.dataSource
      .getRepository(Rent)
      .createQueryBuilder('rent');

    if (filterObject.idScooters) {
      query.andWhere('rent.id_scooters = :idScooters', {
        idScooters: `%${filterObject.idScooters}%`,
      });
    }

    if (filterObject.idUsers) {
      query.andWhere('rent.id_users = :idUsers', {
        idUsers: `%${filterObject.idUsers}%`,
      });
    }

    if (filterObject.startDate && filterObject.endDate) {
      query.andWhere(
        '(rent.start_date, rent.end_date) OVERLAPS (:startDate, :endDate)',
        { startDate: filterObject.startDate, endDate: filterObject.endDate },
      );
    } else if (filterObject.startDate) {
      query.andWhere('rent.start_date > :startDate', {
        startDate: filterObject.startDate,
      });
    } else if (filterObject.endDate) {
      query.andWhere('rent.end_date < :endDate', {
        endDate: filterObject.endDate,
      });
    }

    const order = pageRequest.order;

    Object.keys(order).forEach((key) => {
      const snakeKey = camelToSnake(key);
      query.addOrderBy(snakeKey, order[key]);
    });

    query.take(pageRequest.take);
    query.skip(pageRequest.skip);

    const [rents, count] = await query.getManyAndCount();

    return new PageResponse(rents, count, pageRequest);
  }

  async findOne(id: number) {
    const rent = await this.rentRepository.findOne({ where: { idRents: id } });
    if (!rent) throw new CargoException(CargoReturenCode.NOT_FOUND);
    return rent;
  }

  async update(id: number, updateRentDto: UpdateRentDto, user: User) {
    await this.rentRepository.update(id, {
      ...updateRentDto,
      updIdUsers: user.idUsers,
    });
    return this.findOne(id);
  }

  remove(id: number) {
    this.rentRepository.delete(id);
  }
}
