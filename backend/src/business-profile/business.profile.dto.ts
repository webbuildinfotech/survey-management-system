import {
  IsString,
  IsNumber,
  IsOptional,
  IsArray,
  IsUrl,
} from 'class-validator';

export class CreateBusinessProfileDto {
  @IsString()
  name!: string;

  @IsString()
  city!: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  full_address?: string;

  @IsString()
  @IsOptional()
  street_address?: string;

  @IsString()
  @IsOptional()
  category?: string;

  @IsString()
  @IsOptional()
  hours?: string;

  @IsUrl()
  @IsOptional()
  website?: string;

  @IsString()
  @IsOptional()
  closed_status?: string;

  @IsUrl()
  @IsOptional()
  google_maps_url?: string;

  @IsString()
  @IsOptional()
  place_id?: string;

  @IsArray()
  @IsOptional()
  photos?: string[];

  @IsString()
  @IsOptional()
  greater_city_area?: string;

  @IsNumber()
  @IsOptional()
  rating?: number;

  @IsNumber()
  @IsOptional()
  review_count?: number;
}
