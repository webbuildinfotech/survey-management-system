//users.dto.ts
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsEmail,
  IsMongoId,
} from 'class-validator';

export class UserDto {
  @IsNotEmpty()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  mobile?: string;

  @IsNotEmpty()
  @IsEmail()
  email?: string;

  @IsNotEmpty()
  @IsString()
  password?: string;

  @IsNotEmpty()
  @IsString()
  city?: string;

  @IsOptional()
  @IsMongoId()
  roleId?: string;

  @IsOptional()
  isDeleted?: boolean;

  @IsOptional()
  createdAt?: Date;

  @IsOptional()
  updatedAt?: Date;
}
