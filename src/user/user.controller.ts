import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Cargo } from 'src/models/cargo.model';

@ApiTags('user')
@ApiBearerAuth()
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Patch('/update-password')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '用戶更新密碼' })
  @ApiResponse({ status: 200, description: '0000 Success' })
  @ApiBody({
    schema: {
      properties: {
        oldPassword: { type: 'string' },
        newPassword: { type: 'string' },
      },
    },
  })
  async updatePassword(@Request() req, @Body() dto: UpdatePasswordDto) {
    await this.userService.updatePassword(dto, req.user);
    return new Cargo(null);
  }
}
