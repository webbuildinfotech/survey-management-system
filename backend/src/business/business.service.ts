import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import axios from 'axios';
import * as fs from 'fs';
import * as path from 'path';
import { BusinessEntity } from './business.entity';
import { CreateBusinessDto } from './create-business.dto';

@Injectable()
export class BusinessService {
  private readonly logger = new Logger(BusinessService.name);

  constructor(
    @InjectRepository(BusinessEntity)
    private businessRepository: Repository<BusinessEntity>,
  ) {}

  private extractPlaceId(url: string): string | null {
    try {
      const match = url.match(/place_id[:=]([^&]+)/);
      return match ? match[1] : null;
    } catch {
      return null;
    }
  }

  private async getGooglePlaceDetails(placeId: string) {
    try {
      const response = await axios.get(
        'https://maps.googleapis.com/maps/api/place/details/json',
        {
          params: {
            place_id: placeId,
            key: process.env.GOOGLE_API_KEY,
            fields: 'formatted_phone_number,opening_hours,photos,rating,user_ratings_total',
          },
        },
      );

      const result = response.data.result;

      return {
        phone: result.formatted_phone_number || null,
        hours: result.opening_hours?.weekday_text || [],
        photos:
          result.photos?.slice(0, 3).map(
            (photo: { photo_reference: any; }) =>
              `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${photo.photo_reference}&key=${process.env.GOOGLE_API_KEY}`,
          ) || [],
        rating: isNaN(parseFloat(result.rating)) ? 0 : parseFloat(result.rating),
        review_count: isNaN(parseInt(result.user_ratings_total)) ? 0 : parseInt(result.user_ratings_total),
      };
    } catch (error:any) {
      this.logger.error(`Failed Google API for ${placeId}: ${error.message}`);
      return {
        phone: null,
        hours: [],
        photos: [],
        rating: 0,
        review_count: 0,
      };
    }
  }

  async seedBusinesses() {
    try {
      const businesses = JSON.parse(
        fs.readFileSync(path.join(__dirname, '../data/businesses.json'), 'utf-8'),
      );

      for (const item of businesses) {
        const placeId = this.extractPlaceId(item.google_maps_url);
        const greaterCityArea = `${item.g_city} - ${item.g_state}`;

        // Check for existing business
        const existingBusiness = placeId
          ? await this.businessRepository.findOne({ where: { place_id: placeId } })
          : await this.businessRepository.findOne({
              where: {
                name: item.g_business_name,
                full_address: item.g_full_address,
              },
            });

        if (existingBusiness) {
          this.logger.warn(`Skipped (duplicate): ${item.g_business_name}`);
          continue;
        }

        const googleData = placeId
          ? await this.getGooglePlaceDetails(placeId)
          : {
              phone: item.g_phone,
              hours: item.g_hours_of_operation,
              photos: [],
              rating: isNaN(parseFloat(item.g_rating)) ? 0 : parseFloat(item.g_rating),
              review_count: isNaN(parseInt(item.g_review_count)) ? 0 : parseInt(item.g_review_count),
            };

        const businessDto: CreateBusinessDto = {
          name: item.g_business_name,
          category: item.g_categories,
          full_address: item.g_full_address,
          street_address: item.g_street_address,
          city: item.g_city,
          hours: googleData.hours.length ? googleData.hours : item.g_hours_of_operation,
          website: item.g_website,
          closed_status: item.g_closed_status,
          google_maps_url: item.google_maps_url,
          place_id: placeId || undefined,
          photos: googleData.photos,
          greater_city_area: greaterCityArea,
          rating: googleData.rating,
          review_count: googleData.review_count,
        };

        await this.businessRepository.save(businessDto);
        this.logger.log(`Imported: ${item.g_business_name}`);
      }

      this.logger.log('All businesses imported successfully');
    } catch (error) {
      this.logger.error('Error seeding database:', error);
      throw error;
    }
  }
} 