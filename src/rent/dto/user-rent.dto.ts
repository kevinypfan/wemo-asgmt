import { IsInt } from 'class-validator';

export class UserRentDto {
  @IsInt()
  idScooters: number;
}
