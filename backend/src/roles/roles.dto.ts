// roles.dto.ts
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateRoleDto {
  @IsNotEmpty()
  @IsString()
  name!: string;
}

export class UpdateRoleDto {
  @IsNotEmpty()
  @IsString()
  name!: string;
}
