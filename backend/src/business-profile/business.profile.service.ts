import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BusinessProfile, BusinessProfileDocument } from './business.profile.schema';
import { CreateBusinessProfileDto } from './business.profile.dto';
import axios from 'axios';

const GOOGLE_PLACES_API_KEY ="AIzaSyANzBwVlOrehZLAsP_ugpJMBuO5E42mXjg"
// const GOOGLE_PLACES_API_KEY = process.env.GOOGLE_PLACES_API_KEY as string;
console.log('API Key:', GOOGLE_PLACES_API_KEY ? 'Present' : 'Missing');

@Injectable()
export class BusinessProfileService {

  constructor(
    @InjectModel(BusinessProfile.name)
    private businessProfileModel: Model<BusinessProfileDocument>,
  ) {}

  async searchAndCreateByQuery(query: string, location: string = 'United States'): Promise<BusinessProfile[]> {
    try {
      // First search for places using the query
      const searchResponse = await axios.get(
        `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(query)}&location=${encodeURIComponent(location)}&key=${GOOGLE_PLACES_API_KEY}`
      );

      const places = searchResponse.data.results;
      const results: BusinessProfile[] = [];

      // Create profiles for each place found
      for (const place of places) {
        try {
          const profile = await this.createFromGooglePlaces(place.place_id, GOOGLE_PLACES_API_KEY);
          results.push(profile);
        } catch (error) {
          console.warn(`Failed to create profile for place ${place.name}: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
      }

      return results;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`Failed to search and create profiles: ${error.message}`);
      }
      throw new Error('Failed to search and create profiles: Unknown error');
    }
  }

  async searchAndCreateByCategory(category: string, location: string = 'United States'): Promise<BusinessProfile[]> {
    try {
      console.log('Searching for category:', category, 'in location:', location);
      
      // First, get the coordinates for the location
      const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(location)}&key=${GOOGLE_PLACES_API_KEY}`;
      console.log('Geocode URL:', geocodeUrl);
      
      const geocodeResponse = await axios.get(geocodeUrl);
      console.log('Geocode Response:', JSON.stringify(geocodeResponse.data, null, 2));

      if (!geocodeResponse.data.results || geocodeResponse.data.results.length === 0) {
        throw new Error('Could not find location coordinates');
      }

      const locationCoords = geocodeResponse.data.results[0].geometry.location;
      const { lat, lng } = locationCoords;

      // Search for places in the category using nearby search
      const searchUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=5000&type=${encodeURIComponent(category)}&key=${GOOGLE_PLACES_API_KEY}`;
      console.log('Search URL:', searchUrl);

      const searchResponse = await axios.get(searchUrl);
      console.log('Search Response Status:', searchResponse.status);
      console.log('Search Response Data:', JSON.stringify(searchResponse.data, null, 2));

      if (!searchResponse.data.results || searchResponse.data.results.length === 0) {
        console.log('No results found for the search');
        return [];
      }

      const places = searchResponse.data.results;
      console.log('Found places:', places.length);
      
      const results: BusinessProfile[] = [];

      // Create profiles for each place found
      for (const place of places) {
        try {
          console.log('Processing place:', place.name);
          const profile = await this.createFromGooglePlaces(place.place_id, GOOGLE_PLACES_API_KEY);
          results.push(profile);
          console.log('Successfully created profile for:', place.name);
        } catch (error) {
          console.error(`Failed to create profile for place ${place.name}:`, error);
        }
      }

      return results;
    } catch (error: unknown) {
      console.error('Error in searchAndCreateByCategory:', error);
      if (error instanceof Error) {
        throw new Error(`Failed to search and create profiles by category: ${error.message}`);
      }
      throw new Error('Failed to search and create profiles by category: Unknown error');
    }
  }

  async createFromGooglePlaces(placeId: string, apiKey: string): Promise<BusinessProfile> {
    try {
      console.log('Creating profile for place ID:', placeId);
      
      // Check if profile already exists
      const existingProfile = await this.businessProfileModel.findOne({ place_id: placeId }).exec();
      if (existingProfile) {
        console.log('Profile already exists for place ID:', placeId);
        return existingProfile;
      }

      // Fetch from Google Places API
      const detailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=name,formatted_address,geometry,rating,user_ratings_total,opening_hours,website,photos,types,formatted_phone_number&key=${apiKey}`;
      console.log('Details URL:', detailsUrl);

      const response = await axios.get(detailsUrl);
      console.log('Details Response Status:', response.status);

      if (!response.data.result) {
        throw new Error('No result data in response');
      }

      const place = response.data.result;
      console.log('Place data:', JSON.stringify(place, null, 2));
      
      // Extract city from formatted address
      const addressParts = place.formatted_address.split(',');
      const city = addressParts[1]?.trim() || '';

      // Create business profile directly from Google Places data
      const businessProfile = new this.businessProfileModel({
        name: place.name,
        city,
        full_address: place.formatted_address,
        category: place.types?.[0] || '',
        rating: place.rating,
        review_count: place.user_ratings_total,
        hours: place.opening_hours?.weekday_text?.join('\n'),
        website: place.website,
        photos: place.photos?.map((photo: { photo_reference: string }) => 
          `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photo.photo_reference}&key=${apiKey}`
        ),
        place_id: placeId,
        google_maps_url: `https://www.google.com/maps/place/?q=place_id:${placeId}`,
        phone: place.formatted_phone_number,
        latitude: place.geometry?.location?.lat,
        longitude: place.geometry?.location?.lng,
      });

      const savedProfile = await businessProfile.save();
      console.log('Successfully saved profile:', (savedProfile as any).name);
      return savedProfile;
    } catch (error: unknown) {
      console.error('Error in createFromGooglePlaces:', error);
      if (error instanceof Error) {
        throw new Error(`Failed to create business profile: ${error.message}`);
      }
      throw new Error('Failed to create business profile: Unknown error');
    }
  }

  async createMultipleFromGooglePlaces(placeIds: string[], apiKey: string): Promise<BusinessProfile[]> {
    const results: BusinessProfile[] = [];
    const errors: string[] = [];

    for (const placeId of placeIds) {
      try {
        const profile = await this.createFromGooglePlaces(placeId, apiKey);
        results.push(profile);
      } catch (error) {
        errors.push(`Failed to process place ID ${placeId}: ${error instanceof Error ? error.message : 'Unknown error'}`);
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

  async findOne(id: string): Promise<BusinessProfile> {
    const profile = await this.businessProfileModel.findById(id).exec();
    if (!profile) {
      throw new NotFoundException(`Business profile with ID ${id} not found`);
    }
    return profile;
  }

  async findByPlaceId(placeId: string): Promise<BusinessProfile> {
    const profile = await this.businessProfileModel.findOne({ place_id: placeId }).exec();
    if (!profile) {
      throw new NotFoundException(`Business profile with place ID ${placeId} not found`);
    }
    return profile;
  }

  async searchByCategory(category: string): Promise<BusinessProfile[]> {
    return this.businessProfileModel
      .find({ category: { $regex: category, $options: 'i' } })
      .exec();
  }
}
