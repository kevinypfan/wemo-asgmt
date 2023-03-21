import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { RentService } from './rent.service';
import { CreateRentDto } from './dto/create-rent.dto';
import { UpdateRentDto } from './dto/update-rent.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../auth/role.enum';
import { UserRentDto } from './dto/user-rent.dto';
import { Cargo } from '../models/cargo.model';

@ApiTags('rent')
@ApiBearerAuth()
@Controller('rent')
export class RentController {
  constructor(private readonly rentService: RentService) {}

  @Post()
  @ApiOperation({ summary: '用戶租車' })
  @ApiResponse({ status: 201, description: '0000 Success (201)' })
  @ApiResponse({ status: 2000, description: 'User Rented (403)' })
  @ApiResponse({ status: 2001, description: 'Scooter Rented (403)' })
  @ApiResponse({ status: 9999, description: 'Unknown Error (500)' })
  @ApiBody({
    schema: {
      properties: {
        idScooters: { type: 'number' },
      },
    },
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.User)
  async create(@Request() req, @Body() dto: UserRentDto) {
    const rent = await this.rentService.rent(dto, req.user);
    return new Cargo(rent);
  }

  @Get()
  @ApiOperation({ summary: '取得已租車陣列' })
  @ApiResponse({ status: 200, description: '0000 Success (200)' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.User)
  async findAll(@Request() req) {
    const rents = await this.rentService.findAll(req.user);
    return new Cargo(rents);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.User)
  @ApiOperation({ summary: '用戶還車' })
  @ApiResponse({ status: 200, description: '0000 Success (200)' })
  async drop(@Request() req, @Param('id') id: string) {
    const rent = await this.rentService.drop(+id, req.user);
    return new Cargo(rent);
  }
}
