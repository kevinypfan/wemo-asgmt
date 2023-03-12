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
import { PageRequest } from 'src/models/page-request';
import { FilterScooterDto } from './dto/filter-scooter.dto';
import { PageResponse } from 'src/models/page-response';
import { camelToSnake } from 'src/utils/helpers';

@Injectable()
export class ScooterService {
  constructor(
    private dataSource: DataSource,
    @InjectRepository(Scooter)
    private scooterRepository: Repository<Scooter>,
  ) {}

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
}
