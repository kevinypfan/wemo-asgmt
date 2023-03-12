import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Cargo, CargoReturenCode } from 'src/models/cargo.model';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import * as argon2 from 'argon2';
import { SignupUserDto } from 'src/auth/dto/signup-user.dto';

@Injectable()
export class AdminUserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(dto: SignupUserDto) {
    const user = this.userRepository.create(dto);

    const hashedPassword = await argon2.hash(user.password);

    user.lastLogin = new Date();
    user.password = hashedPassword;

    return await this.userRepository.save(user);
  }

  findAll() {
    return this.userRepository.find();
  }

  findOne(id: number) {
    return this.userRepository.findOne({ where: { idUsers: id } });
  }

  findByUsername(username: string) {
    return this.userRepository.findOne({ where: { username } });
  }
}
