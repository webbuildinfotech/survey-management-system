//users.dto.ts
import { IsUUID } from 'class-validator';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsBoolean,
  IsNumber,
  IsEmail,
  IsEnum,
  MinLength,
} from 'class-validator';



export class UserDto {
  @IsNotEmpty()
  @IsString()
  name?: string;

  @IsNotEmpty()
  @IsString()
  mobile?: string;

  @IsNotEmpty()
  @IsEmail()
  email?: string;

  @IsNotEmpty()
  @IsString()
  password?: string;

  @IsOptional()
  @IsUUID()
  roleId?: string; // role as foreign key

  @IsOptional()
  isDeleted?: boolean;

  @IsOptional()
  createdAt?: Date;

  @IsOptional()
  updatedAt?: Date;
  role: any;
}
