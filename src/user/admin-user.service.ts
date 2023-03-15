import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Cargo, CargoReturnCode } from '../models/cargo.model';
import { DataSource, Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import * as argon2 from 'argon2';
import { SignupUserDto } from '../auth/dto/signup-user.dto';
import { CargoException } from 'src/models/cargo.exception';
import { UpdateRolesDto } from './dto/update-roles.dto';
import { PageRequest } from 'src/models/page-request';
import { FilterUserDto } from './dto/filter-user.dto';
import { camelToSnake } from 'src/utils/helpers';
import { PageResponse } from 'src/models/page-response';

@Injectable()
export class AdminUserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private dataSource: DataSource,
  ) {}

  async create(dto: SignupUserDto) {
    const user = this.userRepository.create(dto);

    const hashedPassword = await argon2.hash(user.password);

    user.lastLogin = new Date();
    user.password = hashedPassword;

    return await this.userRepository.save(user);
  }

  async findAll(pageRequest: PageRequest, filterObject: FilterUserDto) {
    const query = this.dataSource
      .getRepository(User)
      .createQueryBuilder('user');

    if (filterObject.username) {
      query.andWhere('user.username ilike :username', {
        username: `%${filterObject.username}%`,
      });
    }

    if (filterObject.roles) {
      query.andWhere('user.roles ilike :roles', {
        roles: `%${filterObject.roles}%`,
      });
    }

    if (filterObject.email) {
      query.andWhere('user.email ilike :email', {
        email: `%${filterObject.email}%`,
      });
    }

    const order = pageRequest.order;

    Object.keys(order).forEach((key) => {
      const snakeKey = camelToSnake(key);
      query.addOrderBy(snakeKey, order[key]);
    });

    query.take(pageRequest.take);
    query.skip(pageRequest.skip);

    const [users, count] = await query.getManyAndCount();

    return new PageResponse(users, count, pageRequest);
  }

  async findOne(id: number) {
    const user = await this.userRepository.findOne({ where: { idUsers: id } });

    if (!user) throw new CargoException(CargoReturnCode.NOT_FOUND);
    return user;
  }

  findByUsername(username: string) {
    return this.userRepository.findOne({ where: { username } });
  }

  async updateRoles(id: number, dto: UpdateRolesDto) {
    const user = await this.findOne(id);
    user.roles = dto.roles;
    return this.userRepository.save(user);
  }
}
