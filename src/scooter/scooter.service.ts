import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Cargo, CargoReturenCode } from 'src/models/cargo.model';
import { Repository } from 'typeorm';
import { CreateScooterDto } from './dto/create-scooter.dto';
import { UpdateScooterDto } from './dto/update-scooter.dto';
import { Scooter } from './entities/scooter.entity';

@Injectable()
export class ScooterService {
  constructor(
    @InjectRepository(Scooter)
    private scooterRepository: Repository<Scooter>,
  ) {}

  create(createScooterDto: CreateScooterDto) {
    const scooter = this.scooterRepository.create(createScooterDto);
    return this.scooterRepository.save(scooter);
  }

  findAll() {
    return this.scooterRepository.find();
  }

  async findOne(id: number) {
    const scooter = await this.scooterRepository.findOne({
      where: { idScooters: id },
    });
    if (!scooter)
      throw new HttpException(
        new Cargo(null, CargoReturenCode.NOT_FOUND),
        HttpStatus.NOT_FOUND,
      );
    return scooter;
  }

  async update(id: number, updateScooterDto: UpdateScooterDto) {
    await this.scooterRepository.update(id, updateScooterDto);
    return this.findOne(id);
  }

  remove(id: number) {
    this.scooterRepository.delete(id);
  }
}
