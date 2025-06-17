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
// console.log('API Key:', GOOGLE_PLACES_API_KEY ? 'Present' : 'Missing');

@Injectable()
export class BusinessProfileService {
  constructor(
    @InjectModel(Business.name)
    private BusinessModel: Model<BusinessDocument>,
    private googleAI: GoogleGenAI,
  ) {}

  async createFromGooglePlaces(
    placeId: string,
    apiKey: string,
  ): Promise<Business> {
    try {
      const apiKey = GOOGLE_PLACES_API_KEY;
      // Check if profile already exists
      const existingProfile = await this.BusinessModel.findOne({
        place_id: placeId,
      }).exec();
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
      // 1. AI intent and location
      // const analysisPrompt = `
      //   Analyze this search query and map it to Google Places API categories:
      //   Query: "${query}"

      //   Return a JSON with:
      //   {
      //     "location": "extracted location",
      //     "intent": "main search intent",
      //     "categories": ["list", "of", "relevant", "google", "places", "categories"]
      //   }
      // `;

      const analysisPrompt = `
step:1 Your are Proffwsional Analyze this search query and map it to Google Places API categories
Query: "${query}"
Your task is to:
1. Identify the location in the query.
2. Determine the main intent of the user, even if the language is emotional or vague (e.g., "lovely", "cool", "famous").
3. Dynamically map that intent to real, specific Google Places API categories such as: "restaurant", "park", "gym", "beauty_salon", "tourist_attraction", "school", "hospital", etc.

step:2 Google Places categories are context-sensitive, so choose only those that actually match the user’s underlying interest.
### Examples:
- "a beautiful spot in Bangalore" → { location: "Bangalore", intent: "scenic location", categories: ["tourist_attraction", "park"] }
- "cool hangout in Mumbai" → { location: "Mumbai", intent: "hangout place", categories: ["cafe", "bar", "night_club"] }
- "the lovely place in Delhi" → { location: "Delhi", intent: "romantic or scenic place", categories: ["tourist_attraction", "monument", "park"] }
- "top gym in Pune" → { location: "Pune", intent: "find gym", categories: ["gym"] }
- "famous food in Indore" → { location: "Indore", intent: "find popular food", categories: ["restaurant", "food"] }
- "historical sites near Jaipur" → { location: "Jaipur", intent: "visit historical places", categories: ["museum", "tourist_attraction", "landmark"] }
Query: "${query}"

step:3 Now return a strict JSON with:
{
  "location": "city or area name",
  "intent": "user’s inferred search intent",
  "categories": ["list", "of", "google_places_api", "categories"]
}
`;

      const aiResponse = await this.googleAI.models.generateContent({
        model: 'gemini-2.0-flash',
        contents: [{ role: 'user', parts: [{ text: analysisPrompt }] }],
      });
      // console.log('Token usage:', aiResponse?.usage); 

      const aiText =
        aiResponse?.candidates?.[0]?.content?.parts?.[0]?.text || '';
      const cleanJson = aiText.replace(/```json\n?|\n?```/g, '').trim();

      let location = '';
      let intent = '';
      let categories: string[] = [];

      try {
        const parsed = JSON.parse(cleanJson);
        location = parsed.location || '';
        intent = parsed.intent || '';
        categories = parsed.categories || [];
      } catch (err) {
        console.error('AI JSON parsing failed:', err);
      }

      // 2. metro area
      const metroPrompt = `
      List ALL major areas around ${location} including:
      - Main city areas
      - All major suburbs
      - All surrounding towns within 30 miles
      - All important neighborhoods

      Return ONLY a comma-separated list of area names, nothing else.
      `;

      const aiArea = await this.googleAI.models.generateContent({
        model: 'gemini-2.0-flash',
        contents: [{ role: 'user', parts: [{ text: metroPrompt }] }],
      });

      const rawText = aiArea?.candidates?.[0]?.content?.parts?.[0]?.text || '';

      const metroAreas = rawText
        .replace(/\[|\]/g, '')
        .split(',')
        .map((area) => area.trim().replace(/^"|"$/g, ''))
        .filter((area) => area && !area.includes('\n'))
        .filter((area, index, self) => self.indexOf(area) === index);

      const allLocations = [location, ...metroAreas];
      // const cityRegexConditions = allLocations.map((area) => ({
      //   g_city: { $regex: area, $options: 'i' },
      // }));
      const cleanedAreas = allLocations.map((area) => {
        if (
          area.toLowerCase().includes(location.toLowerCase()) &&
          area.toLowerCase() !== location.toLowerCase()
        ) {
          // Remove the city name from compound areas like "Downtown Anchorage"
          return area.replace(new RegExp(`\\s*${location}`, 'i'), '').trim();
        }
        return area;
      });

      const cityRegexConditions = cleanedAreas.map((area) => ({
        g_city: { $regex: `\\b${area}\\b`, $options: 'i' },
      }));

      console.log('City Regex Conditions:', cityRegexConditions);
      console.log('Intent:', intent);

      const processCategories = (categories: string[]) => {
        return categories
          .map((cat) => {
            const variations = [
              cat, // like "bus_station"
              cat.replace(/_/g, ' '), // like "bus station"
              cat.split('_').join(' '), // like "bus station"
              cat.split('_')[0], // like "bus"
              cat.replace(/_/g, ''), // like "busstation"
            ];
            return variations;
          })
          .flat();
      };

      const expandedCategories = processCategories(categories);

      console.log('Categories:', expandedCategories);
      const matchedPlaces = await this.BusinessModel.find({
        $and: [
          {
            $or: [
              // single string case

              { g_categories: { $in: expandedCategories } },
              // array case
              { g_categories: { $elemMatch: { $in: expandedCategories } } },
              // partial match for
              ...expandedCategories.map((category) => ({
                $or: [
                  {
                    g_categories: {
                      $regex: new RegExp(`\\b${category}\\b`, 'i'),
                    },
                  },
                  {
                    g_categories: {
                      $elemMatch: {
                        $regex: new RegExp(`\\b${category}\\b`, 'i'),
                      },
                    },
                  },
                ],
              })),
            ],
          },
          {
            $or: cityRegexConditions,
          },
        ],
      })

        .sort({ google_maps_url: 1 }) // sort by google_maps_url
        .exec();

      // Step 1: Score businesses by number of matched categories
      const scoredPlaces = matchedPlaces.map((business) => {
        const businessCategories = Array.isArray(business.g_categories)
          ? business.g_categories
          : [business.g_categories];

        const matchCount = businessCategories.reduce((count, cat) => {
          return (
            count +
            expandedCategories.filter((expandedCat) =>
              new RegExp(`\\b${expandedCat}\\b`, 'i').test(cat),
            ).length
          );
        }, 0);
        return {
          business,
          matchScore: matchCount,
        };
      });
      // Step 2: Sort by matchScore (descending)
      const sortedPlaces = scoredPlaces
        .sort((a, b) => b.matchScore - a.matchScore)
        .map((entry) => entry.business);
      // Step 3: Remove duplicates by google_maps_url
      const uniquePlaces = sortedPlaces.reduce<Business[]>((acc, current) => {
        const exists = acc.find(
          (item) => item.google_maps_url === current.google_maps_url,
        );
        if (!exists) {
          acc.push(current);
        }
        return acc;
      }, []);

      return uniquePlaces;
    } catch (error) {
      console.error('Error in searchPlaces:', error);
      throw new Error('Failed to search places');
    }
  }
}
