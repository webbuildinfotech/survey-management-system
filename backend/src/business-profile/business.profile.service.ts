import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
// import {
//   Business,
//   BusinessDocument,
// } from './business.profile.schema';
import axios from 'axios';
import { Business, BusinessDocument } from '../business/business.schema';
import { GoogleGenAI } from '@google/genai';
const GOOGLE_PLACES_API_KEY = 'AIzaSyBdwSXsHESmuxHEKMdSu2DXfgMPrqYvJSE';
// const GOOGLE_PLACES_API_KEY = process.env.GOOGLE_PLACES_API_KEY as string;
console.log('API Key:', GOOGLE_PLACES_API_KEY ? 'Present' : 'Missing');

interface GooglePlace {
  place_id: string;
  name: string;
  formatted_address: string;
  rating: number;
  types: string[];
  is_existing: boolean;
}

@Injectable()
export class BusinessProfileService {
  constructor(
    @InjectModel(Business.name)
    private BusinessModel: Model<BusinessDocument>,
    private googleAI: GoogleGenAI,
  ) {}

  private calculateNameSimilarity(name1: string, name2: string): number {
    const str1 = name1.toLowerCase();
    const str2 = name2.toLowerCase();
    
    // Remove special characters and extra spaces
    const clean1 = str1.replace(/[^a-z0-9]/g, '').trim();
    const clean2 = str2.replace(/[^a-z0-9]/g, '').trim();
    
    // Calculate similarity percentage
    const longer = clean1.length > clean2.length ? clean1 : clean2;
    const shorter = clean1.length > clean2.length ? clean2 : clean1;
    
    if (longer.length === 0) return 1.0;
    
    return (longer.length - this.editDistance(longer, shorter)) / longer.length;
  }

  private editDistance(str1: string, str2: string): number {
    const track = Array(str2.length + 1).fill(null).map(() =>
      Array(str1.length + 1).fill(null));
    
    for (let i = 0; i <= str1.length; i += 1) {
      track[0][i] = i;
    }
    for (let j = 0; j <= str2.length; j += 1) {
      track[j][0] = j;
    }

    for (let j = 1; j <= str2.length; j += 1) {
      for (let i = 1; i <= str1.length; i += 1) {
        const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
        track[j][i] = Math.min(
          track[j][i - 1] + 1,
          track[j - 1][i] + 1,
          track[j - 1][i - 1] + indicator
        );
      }
    }

    return track[str2.length][str1.length];
  }

  async createFromGooglePlaces(
    placeId: string,
    apiKey: string,
  ): Promise<Business> {
    try {
      const apiKey = GOOGLE_PLACES_API_KEY;
      // Check if profile already exists
      const existingProfile = await this.BusinessModel
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
      const Business = new this.BusinessModel({
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

      const savedProfile = await Business.save();
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
  ): Promise<Business[]> {
    const results: Business[] = [];
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

  async findAll(): Promise<Business[]> {
    return this.BusinessModel.find().exec();
  }

  async searchPlacesData(query: string, location?: string): Promise<any[]> {
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

      // Construct the search URL with location in the query itself
      let searchQuery = query;
      if (location) {
        searchQuery = `${query} in ${location}`;
      }

      const searchUrl = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(searchQuery)}&key=${apiKey}`;

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


  async searchPlaces(query: string): Promise<any[]> {
    try {
      const apiKey = GOOGLE_PLACES_API_KEY;
      if (!apiKey) {
        throw new Error('Google Places API key is not configured');
      }

      // AI से क्वेरी को समझने के लिए प्रॉम्प्ट बनाएं
      const analysisPrompt = `
        Analyze this search query to extract location and search intent:
        Query: "${query}"
        
        Please provide:
        1. The location mentioned (if any)
        2. The search intent (what kind of places they're looking for)
        Format: JSON with "location" and "intent" fields
      `;

      // AI से विश्लेषण प्राप्त करें
      const aiResponse = await this.googleAI.models.generateContent({
        model: 'gemini-2.0-flash',
        contents: [{ role: 'user', parts: [{ text: analysisPrompt }] }],
      });

      const aiAnalysis = aiResponse?.candidates?.[0]?.content?.parts?.[0]?.text || '';
      let location = '';
      let searchIntent = '';

      try {
        // मार्कडाउन फॉर्मेटिंग को हटाएं
        const cleanJson = aiAnalysis.replace(/```json\n?|\n?```/g, '').trim();
        const parsedAnalysis = JSON.parse(cleanJson);
        location = parsedAnalysis.location || '';
        searchIntent = parsedAnalysis.intent || '';
      } catch (e) {
        console.error('Failed to parse AI analysis:', e);
      }

      // अगर लोकेशन नहीं मिली है, तो Geocoding API का उपयोग करें
      if (!location) {
        const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(query)}&key=${apiKey}`;
        const geocodeResponse = await axios.get(geocodeUrl);
        
        if (geocodeResponse.data.results && geocodeResponse.data.results.length > 0) {
          const addressComponents = geocodeResponse.data.results[0].address_components;
          const cityComponent = addressComponents.find(
            (component: any) => component.types.includes('locality')
          );
          if (cityComponent) {
            location = cityComponent.long_name;
          }
        }
      }

      // अब सर्च क्वेरी बनाएं
      let searchQuery = searchIntent || query;
      if (location) {
        searchQuery = `${searchQuery} in ${location}`;
      }

      // console.log('Final search query:', searchQuery); // डीबग के लिए
      
      const searchUrl = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(searchQuery)}&key=${apiKey}`;
      
      const placesResponse = await axios.get(searchUrl);
      
      if (!placesResponse.data.results) {
        return [];
      }

      // Get all places from database in the specified location
      const existingPlaces = await this.BusinessModel.find({
        g_city: location
      }).exec();

      // Match Google results with database entries
      const matchedPlaces = placesResponse.data.results.map((googlePlace: any) => {
        const bestMatch = existingPlaces.find(dbPlace => {
          if (!googlePlace?.name || !dbPlace?.g_business_name) {
            return false;
          }
          const similarity = this.calculateNameSimilarity(
            googlePlace.name,
            dbPlace.g_business_name
          );
          console.log('Similarity:', similarity);
          return similarity >= 0.8; // 80% match threshold
        });

        if (bestMatch) {
          return {
            ...bestMatch.toObject(),
            is_existing: true
          };
        }

        return {
          name: googlePlace.name || '',
          place_id: googlePlace.place_id || '',
          formatted_address: googlePlace.formatted_address || '',
          rating: googlePlace.rating || 0,
          types: googlePlace.types || [],
          is_existing: false
        };
      });

      // Create new profiles for unmatched places
      const newPlaces = await Promise.all(
        matchedPlaces
          .filter((place: GooglePlace) => !place.is_existing)
          .map(async (place: GooglePlace) => {
            try {
              return await this.createFromGooglePlaces(place.place_id, apiKey);
            } catch (error) {
              console.error(`Failed to create profile for place ${place.place_id}:`, error);
              return null;
            }
          })
      );

      // Combine results
      const results = [
        ...matchedPlaces.filter((place: { is_existing: any; }) => place.is_existing),
        ...newPlaces.filter(place => place !== null)
      ];

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
