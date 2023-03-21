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
  Query,
} from '@nestjs/common';
import { ScooterService } from './scooter.service';
import { CreateScooterDto } from './dto/create-scooter.dto';
import { UpdateScooterDto } from './dto/update-scooter.dto';
import { Cargo } from '../models/cargo.model';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../auth/role.enum';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { RolesGuard } from '../auth/roles.guard';
import { PageRequest } from '../models/page-request';
import { ObjectUtils } from '../utils/helpers';
import { FilterScooterDto } from './dto/filter-scooter.dto';
@ApiTags('scooter')
@ApiBearerAuth()
@Controller('scooter')
export class ScooterController {
  constructor(private readonly scooterService: ScooterService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '查詢多筆 Scooter' })
  @ApiResponse({ status: 200, description: '0000 Success' })
  @ApiQuery({
    name: 'size',
    type: 'number',
    required: false,
    schema: { default: 20 },
  })
  @ApiQuery({
    name: 'page',
    type: 'number',
    required: false,
    schema: { default: 0 },
  })
  @ApiQuery({
    name: 'sorts',
    type: 'string',
    required: false,
    example: 'idScooters,desc;updDate,asc',
  })
  @ApiQuery({
    name: 'filter',
    type: 'json',
    required: false,
    description: 'JSON FilterScooterDto',
  })
  async findAll(
    @Query('size') size,
    @Query('page') page,
    @Query('sorts') sorts,
    @Query('filter') filter,
  ) {
    const filterObject: FilterScooterDto = ObjectUtils.removeEmpty(
      JSON.parse(decodeURIComponent(filter || '{}')),
    );

    const pageRequest = new PageRequest(page, size, sorts);

    const scooters = await this.scooterService.findAll(
      pageRequest,
      filterObject,
    );
    return new Cargo(scooters);
  }

  @Get(':id')
  @ApiOperation({ summary: '查詢單筆 Scooter' })
  @ApiResponse({ status: 200, description: '0000 Success' })
  @UseGuards(JwtAuthGuard)
  async findOne(@Param('id') id: string) {
    const scooter = await this.scooterService.findOne(+id);
    return new Cargo(scooter);
  }
}
