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


  @Get('all')
  async findAll(): Promise<BusinessProfile[]> {
    return this.businessProfileService.findAll();
  }

  @Get('search/places')
  async searchPlaces(
    @Query('query') query: string,
    @Query('location') location?: string,
  ): Promise<any[]> {
    if (!query) {
      throw new Error('Query parameter is required');
    }
    
    console.log('Received search request:', { query, location });
    const results = await this.businessProfileService.searchPlaces(query, location);
    console.log('Search results count:', results.length);
    return results;
  }
}
