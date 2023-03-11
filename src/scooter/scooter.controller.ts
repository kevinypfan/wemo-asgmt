import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ScooterService } from './scooter.service';
import { CreateScooterDto } from './dto/create-scooter.dto';
import { UpdateScooterDto } from './dto/update-scooter.dto';
import { Cargo } from 'src/models/cargo.model';

@Controller('scooter')
export class ScooterController {
  constructor(private readonly scooterService: ScooterService) {}

  @Post()
  async create(@Body() createScooterDto: CreateScooterDto) {
    const scooter = await this.scooterService.create(createScooterDto);
    return new Cargo(scooter);
  }

  @Get()
  async findAll() {
    const scooters = await this.scooterService.findAll();
    return new Cargo(scooters);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const scooter = await this.scooterService.findOne(+id);
    return new Cargo(scooter);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateScooterDto: UpdateScooterDto,
  ) {
    const scooter = await this.scooterService.update(+id, updateScooterDto);
    return new Cargo(scooter);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    this.scooterService.remove(+id);
    return new Cargo(null);
  }
}
