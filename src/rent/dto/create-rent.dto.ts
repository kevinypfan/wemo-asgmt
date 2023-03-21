import { IsDateString, IsInt, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateRentDto {
  @IsNotEmpty()
  @IsInt()
  idScooters: number;

  @IsNotEmpty()
  @IsInt()
  idUsers: number;

  @IsDateString()
  startDate?: Date;

  @IsDateString()
  @IsOptional()
  endDate?: Date;
}
