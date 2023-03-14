import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import * as argon2 from 'argon2';
import { SignupUserDto } from './dto/signup-user.dto';
import { Cargo, CargoReturenCode } from '../models/cargo.model';
import { ResponseUserDto } from './dto/response-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { CargoException } from '../models/cargo.exception';

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UserService))
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.userService.findByUsername(username);
    if (!user) throw new CargoException(CargoReturenCode.NOT_FOUND);

    const isVerify = await argon2.verify(user.password, password);
    if (!isVerify) throw new CargoException(CargoReturenCode.BAD_CREDENTIALS);

    return user;
  }

  public async signup(dto: SignupUserDto): Promise<Cargo<ResponseUserDto>> {
    const existUser = await this.userService.findByUsername(dto.username);

    if (existUser) throw new CargoException(CargoReturenCode.USER_EXIEST);

    const user = await this.userService.create(dto);

    user.roles = 'user';

    const resUser = new ResponseUserDto();

    const payload = {
      username: user.username,
      sub: user.idUsers,
      email: user.email,
      roles: user.roles,
    };

    resUser.email = user.email;
    resUser.lastLogin = user.lastLogin;
    resUser.username = user.username;
    resUser.accessToken = this.jwtService.sign(payload);

    return new Cargo(resUser);
  }

  async login(dto: LoginUserDto) {
    const user = await this.validateUser(dto.username, dto.password);

    const payload = {
      username: user.username,
      sub: user.idUsers,
      email: user.email,
      roles: user.roles,
    };

    const resUser = new ResponseUserDto();

    resUser.email = user.email;
    resUser.lastLogin = user.lastLogin;
    resUser.username = user.username;
    resUser.accessToken = this.jwtService.sign(payload);

    return new Cargo(resUser);
  }
}
