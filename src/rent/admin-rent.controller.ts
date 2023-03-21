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
import { CreateRentDto } from './dto/create-rent.dto';
import { UpdateRentDto } from './dto/update-rent.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiExtraModels,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../auth/role.enum';
import { AdminRentService } from './admin-rent.service';
import { FilterRentDto } from './dto/filter-rent.dto';
import { ObjectUtils } from '../utils/helpers';
import { PageRequest } from '../models/page-request';
import { Cargo } from '../models/cargo.model';

@ApiTags('admin/rent')
@ApiBearerAuth()
@Controller('admin/rent')
export class AdminRentController {
  constructor(private readonly adminRentService: AdminRentService) {}

  @Post()
  @ApiOperation({ summary: '後台新增租車資訊' })
  @ApiBody({
    schema: {
      properties: {
        idScooters: { type: 'number' },
        idUsers: { type: 'number' },
        startDate: { type: 'string', nullable: true },
        endDate: { type: 'string', nullable: true },
      },
    },
  })
  @ApiResponse({ status: 200, description: '0000 Success (200)' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  async create(@Request() req, @Body() createRentDto: CreateRentDto) {
    const rent = await this.adminRentService.create(createRentDto, req.user);
    return new Cargo(rent);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @ApiOperation({ summary: '後台查詢租車資訊' })
  @ApiResponse({ status: 200, description: '0000 Success (200)' })
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
    example: 'idRents,desc;updDate,asc',
  })
  @ApiExtraModels(FilterRentDto)
  @ApiQuery({
    name: 'filter',
    type: 'json',
    required: false,
    description: 'JSON FilterRentDto',
  })
  async findAll(
    @Query('size') size,
    @Query('page') page,
    @Query('sorts') sorts,
    @Query('filter') filter,
  ) {
    const filterObject: FilterRentDto = ObjectUtils.removeEmpty(
      JSON.parse(decodeURIComponent(filter || '{}')),
    );

    const pageRequest = new PageRequest(page, size, sorts);

    const rents = await this.adminRentService.findAll(
      pageRequest,
      filterObject,
    );

    return new Cargo(rents);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({ summary: '後台查詢單筆租車資訊' })
  @ApiResponse({ status: 200, description: '0000 Success (200)' })
  @ApiResponse({ status: 1404, description: 'Not Found (404)' })
  @Roles(Role.Admin)
  async findOne(@Param('id') id: string) {
    const rent = await this.adminRentService.findOne(+id);
    return new Cargo(rent);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @ApiOperation({ summary: '後台更新單筆租車資訊' })
  @ApiResponse({ status: 200, description: '0000 Success (200)' })
  @ApiResponse({ status: 1404, description: 'Not Found (404)' })
  async update(
    @Request() req,
    @Param('id') id: string,
    @Body() updateRentDto: UpdateRentDto,
  ) {
    const rent = await this.adminRentService.update(
      +id,
      updateRentDto,
      req.user,
    );
    return new Cargo(rent);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @ApiOperation({ summary: '後台刪除單筆租車資訊' })
  @ApiResponse({ status: 200, description: '0000 Success (200)' })
  @ApiResponse({ status: 1404, description: 'Not Found (404)' })
  async remote(@Param('id') id: string) {
    await this.adminRentService.remove(+id);
    return new Cargo(null);
  }
}
