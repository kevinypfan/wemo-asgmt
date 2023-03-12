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
  ApiExtraModels,
  ApiQuery,
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
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  create(@Request() req, @Body() createRentDto: CreateRentDto) {
    return this.adminRentService.create(createRentDto, req.user);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
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
  @Roles(Role.Admin)
  findOne(@Param('id') id: string) {
    return this.adminRentService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  update(
    @Request() req,
    @Param('id') id: string,
    @Body() updateRentDto: UpdateRentDto,
  ) {
    return this.adminRentService.update(+id, updateRentDto, req.user);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  remote(@Param('id') id: string) {
    return this.adminRentService.remove(+id);
  }
}
