import { IsString } from 'class-validator';

export class UpdateRolesDto {
  @IsString()
  roles: string;
}
