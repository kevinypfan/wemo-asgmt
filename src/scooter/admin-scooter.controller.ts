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
  ApiExtraModels,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';
import { RolesGuard } from '../auth/roles.guard';
import { AdminScooterService } from './admin-scooter.service';
import { PageRequest } from '../models/page-request';
import { FilterScooterDto } from './dto/filter-scooter.dto';
import { ObjectUtils } from '../utils/helpers';

@ApiTags('admin/scooter')
@ApiBearerAuth()
@Controller('admin/scooter')
export class AdminScooterController {
  constructor(private readonly adminScooterService: AdminScooterService) {}

  @Post()
  @ApiOperation({ summary: '新增 Scooter' })
  @ApiResponse({ status: 201, description: '0000 Success' })
  @ApiResponse({ status: 1005, description: 'Scooter Exist' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  async create(@Request() req, @Body() createScooterDto: CreateScooterDto) {
    const scooter = await this.adminScooterService.create(
      createScooterDto,
      req.user,
    );
    return new Cargo(scooter);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
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
  @ApiExtraModels(FilterScooterDto)
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

    const scooters = await this.adminScooterService.findAll(
      pageRequest,
      filterObject,
    );
    return new Cargo(scooters);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  async findOne(@Param('id') id: string) {
    const scooter = await this.adminScooterService.findOne(+id);
    return new Cargo(scooter);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  async update(
    @Request() req,
    @Param('id') id: string,
    @Body() updateScooterDto: UpdateScooterDto,
  ) {
    const scooter = await this.adminScooterService.update(
      +id,
      updateScooterDto,
      req.user,
    );
    return new Cargo(scooter);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  async remove(@Param('id') id: string) {
    this.adminScooterService.remove(+id);
    return new Cargo(null);
  }
}
