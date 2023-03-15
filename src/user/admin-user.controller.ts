import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {
  ApiBearerAuth,
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
import { FilterUserDto } from './dto/filter-user.dto';
import { ObjectUtils } from '../utils/helpers';
import { PageRequest } from '../models/page-request';
import { AdminUserService } from './admin-user.service';
import { Cargo } from '../models/cargo.model';
import { UpdateRolesDto } from './dto/update-roles.dto';

@ApiTags('admin/user')
@ApiBearerAuth()
@Controller('admin/user')
export class AdminUserController {
  constructor(private readonly adminUserService: AdminUserService) {}

  @Get()
  @ApiOperation({ summary: '查詢多筆 User' })
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
    example: 'idUsers,desc',
  })
  @ApiExtraModels(FilterUserDto)
  @ApiQuery({
    name: 'filter',
    type: 'json',
    required: false,
    description: 'JSON FilterUserDto',
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  async findAll(
    @Query('size') size,
    @Query('page') page,
    @Query('sorts') sorts,
    @Query('filter') filter,
  ) {
    const filterObject: FilterUserDto = ObjectUtils.removeEmpty(
      JSON.parse(decodeURIComponent(filter || '{}')),
    );

    const pageRequest = new PageRequest(page, size, sorts);

    const users = await this.adminUserService.findAll(
      pageRequest,
      filterObject,
    );

    return new Cargo(users);
  }

  @Get(':id')
  @ApiOperation({ summary: '查詢單筆用戶' })
  @ApiResponse({ status: 200, description: '0000 Success' })
  @ApiResponse({ status: 1404, description: 'Not Found' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  async findOne(@Param('id') id: string) {
    const user = await this.adminUserService.findOne(+id);
    return new Cargo(user);
  }

  @Patch(':id/update-roles')
  @ApiOperation({ summary: '更新用戶權限' })
  @ApiResponse({ status: 200, description: '0000 Success' })
  @ApiResponse({ status: 1404, description: 'Not Found' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  async updateRoles(@Param('id') id: string, @Body() dto: UpdateRolesDto) {
    const user = await this.adminUserService.updateRoles(+id, dto);
    return user;
  }
}
