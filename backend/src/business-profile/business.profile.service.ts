import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  BusinessProfile,
  BusinessProfileDocument,
} from './business.profile.schema';
import axios from 'axios';

const GOOGLE_PLACES_API_KEY = 'AIzaSyBdwSXsHESmuxHEKMdSu2DXfgMPrqYvJSE';
// const GOOGLE_PLACES_API_KEY = process.env.GOOGLE_PLACES_API_KEY as string;
console.log('API Key:', GOOGLE_PLACES_API_KEY ? 'Present' : 'Missing');

@Injectable()
export class BusinessProfileService {
  constructor(
    @InjectModel(BusinessProfile.name)
    private businessProfileModel: Model<BusinessProfileDocument>,
  ) {}

  async createFromGooglePlaces(
    placeId: string,
    apiKey: string,
  ): Promise<BusinessProfile> {
    try {
      const apiKey = GOOGLE_PLACES_API_KEY;
      // Check if profile already exists
      const existingProfile = await this.businessProfileModel
        .findOne({ place_id: placeId })
        .exec();
      if (existingProfile) {
        return existingProfile;
      }

      // Fetch from Google Places API
      const detailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=name,formatted_address,geometry,rating,user_ratings_total,opening_hours,website,photos,types,formatted_phone_number&key=${apiKey}`;

      const response = await axios.get(detailsUrl);
      if (!response.data.result) {
        throw new Error('No result data in response');
      }

      const place = response.data.result;

      // Parse address components
      const addressParts = place.formatted_address.split(',');
      const streetAddress = addressParts[0]?.trim() || '';
      const city = addressParts[1]?.trim() || '';
      const stateZip = addressParts[2]?.trim() || '';
      const country = addressParts[3]?.trim() || '';

      // Extract state and zipcode
      const stateZipParts = stateZip.split(' ');
      const state = stateZipParts[0] || '';
      const zipcode = stateZipParts[1] || '';

      // Create business profile
      const businessProfile = new this.businessProfileModel({
        g_business_name: place.name,
        g_categories: place.types?.[0] || '',
        g_phone: place.formatted_phone_number,
        g_full_address: place.formatted_address,
        g_street_address: streetAddress,
        g_city: city,
        g_state: state,
        g_zipcode: zipcode,
        g_country: country,
        g_latitude: place.geometry?.location?.lat?.toString(),
        g_longitude: place.geometry?.location?.lng?.toString(),
        g_star_rating: place.rating?.toString(),
        g_review_count: place.user_ratings_total?.toString(),
        g_hours_of_operation: place.opening_hours?.weekday_text?.join('\n'),
        g_website: place.website,
        g_closed_status: place.opening_hours?.open_now ? 'OPEN' : 'CLOSED',
        google_maps_url: `https://www.google.com/maps/place/?q=place_id:${placeId}`,
      });

      const savedProfile = await businessProfile.save();
      return savedProfile;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`Failed to create business profile: ${error.message}`);
      }
      throw new Error('Failed to create business profile: Unknown error');
    }
  }

  async createMultipleFromGooglePlaces(
    placeIds: string[],
    apiKey: string,
  ): Promise<BusinessProfile[]> {
    const results: BusinessProfile[] = [];
    const errors: string[] = [];

    for (const placeId of placeIds) {
      try {
        const profile = await this.createFromGooglePlaces(placeId, apiKey);
        results.push(profile);
      } catch (error) {
        errors.push(
          `Failed to process place ID ${placeId}: ${error instanceof Error ? error.message : 'Unknown error'}`,
        );
      }
    }

    if (errors.length > 0) {
      console.warn('Some profiles failed to process:', errors);
    }

    return results;
  }

  async findAll(): Promise<BusinessProfile[]> {
    return this.businessProfileModel.find().exec();
  }

  async searchPlaces(query: string, location?: string): Promise<any[]> {
    try {
      const apiKey = GOOGLE_PLACES_API_KEY;
      if (!apiKey) {
        throw new Error('Google Places API key is not configured');
      }

      console.log('Searching for:', {
        query,
        location,
        apiKey: apiKey ? 'Present' : 'Missing',
      });

      // Construct the search URL
      let searchUrl = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(query)}&key=${apiKey}`;

      // Add location if provided
      if (location) {
        searchUrl += `&location=${encodeURIComponent(location)}`;
      }

      console.log('Search URL:', searchUrl);

      const response = await axios.get(searchUrl);
      console.log('API Response:', JSON.stringify(response.data, null, 2));

      if (!response.data.results) {
        console.log('No results found in response');
        return [];
      }

      if (
        response.data.status !== 'OK' &&
        response.data.status !== 'ZERO_RESULTS'
      ) {
        throw new Error(`Google Places API error: ${response.data.status}`);
      }

      // Map the results to a simpler format
      const results = response.data.results.map(
        (place: {
          place_id: any;
          name: any;
          formatted_address: any;
          rating: any;
          types: any;
          photos: any[];
        }) => ({
          place_id: place.place_id,
          name: place.name,
          formatted_address: place.formatted_address,
          rating: place.rating,
          types: place.types,
          photos: place.photos?.map(
            (photo: { photo_reference: any }) =>
              `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photo.photo_reference}&key=${apiKey}`,
          ),
        }),
      );

      console.log('Processed results:', results.length);
      return results;
    } catch (error) {
      console.error('Error in searchPlaces:', error);
      if (error instanceof Error) {
        throw new Error(`Failed to search places: ${error.message}`);
      }
      throw new Error('Failed to search places: Unknown error');
    }
  }
}
