import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { BusinessProfileService } from './business.profile.service';
import { BusinessProfile } from './business.profile.schema';

@Controller('business-profiles')
export class BusinessProfileController {
  constructor(private readonly businessProfileService: BusinessProfileService) {}

  @Post('create')
  async createFromGooglePlaces(
    @Body('placeId') placeId: string,
    @Body('apiKey') apiKey: string,
  ): Promise<BusinessProfile> {
    return this.businessProfileService.createFromGooglePlaces(placeId, apiKey);
  }

  @Post('create-multiple')
  async createMultipleFromGooglePlaces(
    @Body('placeIds') placeIds: string[],
    @Body('apiKey') apiKey: string,
  ): Promise<BusinessProfile[]> {
    return this.businessProfileService.createMultipleFromGooglePlaces(placeIds, apiKey);
  }

  @Post('search-and-create')
  async searchAndCreateByQuery(
    @Body('query') query: string,
    @Body('location') location?: string,
  ): Promise<BusinessProfile[]> {
    return this.businessProfileService.searchAndCreateByQuery(query, location);
  }

  @Post('search-by-category')
  async searchAndCreateByCategory(
    @Body('category') category: string,
    @Body('location') location?: string,
  ): Promise<BusinessProfile[]> {
    return this.businessProfileService.searchAndCreateByCategory(category, location);
  }

  @Get()
  async findAll(): Promise<BusinessProfile[]> {
    return this.businessProfileService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<BusinessProfile> {
    return this.businessProfileService.findOne(id);
  }

  @Get('place/:placeId')
  async findByPlaceId(@Param('placeId') placeId: string): Promise<BusinessProfile> {
    return this.businessProfileService.findByPlaceId(placeId);
  }

  @Get('search/category')
  async searchByCategory(@Query('category') category: string): Promise<BusinessProfile[]> {
    return this.businessProfileService.searchByCategory(category);
  }
}
