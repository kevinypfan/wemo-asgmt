import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CargoReturnCode } from '../models/cargo.model';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import * as argon2 from 'argon2';
import { SignupUserDto } from '../auth/dto/signup-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { CargoException } from '../models/cargo.exception';
import { AuthService } from '../auth/auth.service';
import { UpdateRolesDto } from './dto/update-roles.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @Inject(forwardRef(() => AuthService))
    private authService: AuthService,
  ) {}

  async create(dto: SignupUserDto) {
    const user = this.userRepository.create(dto);

    const hashedPassword = await argon2.hash(user.password);

    user.lastLogin = new Date();
    user.password = hashedPassword;

    return await this.userRepository.save(user);
  }

  async findOne(id: number) {
    const user = await this.userRepository.findOne({ where: { idUsers: id } });

    if (!user) throw new CargoException(CargoReturnCode.NOT_FOUND);
    return user;
  }

  findByUsername(username: string) {
    return this.userRepository.findOne({ where: { username } });
  }

  async updatePassword(dto: UpdatePasswordDto, user: User) {
    const userEntity = await this.authService.validateUser(
      user.username,
      dto.oldPassword,
    );

    const hashedPassword = await argon2.hash(dto.newPassword);

    userEntity.password = hashedPassword;

    return this.userRepository.save(userEntity);
  }
}
