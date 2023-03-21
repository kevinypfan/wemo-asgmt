import { IsString } from 'class-validator';

export class CreateScooterDto {
  @IsString()
  brand: string;

  @IsString()
  licensePlate: string;
}
