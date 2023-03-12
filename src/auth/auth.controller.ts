import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  Request,
  HttpCode,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Cargo } from '../models/cargo.model';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dto/login-user.dto';
import { SignupUserDto } from './dto/signup-user.dto';
import { JwtAuthGuard } from './jwt-auth.guard';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signup')
  @ApiOperation({ summary: '註冊帳號' })
  @ApiResponse({ status: 1001, description: 'User Exist' })
  @ApiResponse({ status: 201, description: '0000 Success' })
  signup(@Body() dto: SignupUserDto) {
    return this.authService.signup(dto);
  }

  @Post('/login')
  @HttpCode(200)
  @ApiOperation({ summary: '登入帳號' })
  @ApiResponse({ status: 1002, description: 'Bad Credentials' })
  @ApiResponse({ status: 1404, description: 'Not Found' })
  @ApiResponse({ status: 200, description: '0000 Success' })
  login(@Body() dto: LoginUserDto) {
    return this.authService.login(dto);
  }

  @Get('profile')
  @ApiBearerAuth()
  @ApiOperation({ summary: '透過 accessToken 取得用戶資料' })
  @ApiResponse({ status: 200, description: '0000 Success' })
  @ApiResponse({ status: 1003, description: 'UNAUTHORIZED' })
  @UseGuards(JwtAuthGuard)
  getProfile(@Request() req) {
    return new Cargo(req.user);
  }
}
