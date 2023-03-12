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
import { ScooterService } from './scooter.service';
import { CreateScooterDto } from './dto/create-scooter.dto';
import { UpdateScooterDto } from './dto/update-scooter.dto';
import { Cargo } from 'src/models/cargo.model';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Roles } from 'src/auth/roles.decorator';
import { Role } from 'src/auth/role.enum';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { RolesGuard } from 'src/auth/roles.guard';
import { AdminScooterService } from './admin-scooter.service';
@ApiTags('admin/scooter')
@ApiBearerAuth()
@Controller('admin/scooter')
export class AdminScooterController {
  constructor(private readonly adminScooterService: AdminScooterService) {}

  @Post()
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
  async findAll() {
    const scooters = await this.adminScooterService.findAll();
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
