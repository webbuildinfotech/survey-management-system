import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { GoogleGenAI } from '@google/genai';
import { Business, BusinessDocument } from 'business/business.schema';
import axios from 'axios';

const GOOGLE_PLACES_API_KEY = 'AIzaSyBdwSXsHESmuxHEKMdSu2DXfgMPrqYvJSE';

interface QuestionAnalysis {
  intent: string;
  location: string;
  category: string;
  criteria: string[];
  exactCategory: string;
}

interface GooglePlaceResult {
  name: string;
  rating: number;
  user_ratings_total: number;
  types: string[];
  vicinity: string;
  place_id: string;
  reviews?: Array<{
    rating: number;
    text: string;
    time: number;
  }>;
}

interface BusinessScore {
  name: string;
  score: number;
  scoreBreakdown: {
    baseScore: number;
    qualityScore: number;
    relevanceScore: number;
  };
}

@Injectable()
export class AiService {
  private googleAI: GoogleGenAI;
  private cityCache: { cities: string[]; lastUpdated: number } = {
    cities: [],
    lastUpdated: 0,
  };
  private categoryCache: { categories: string[]; lastUpdated: number } = {
    categories: [],
    lastUpdated: 0,
  };
  private readonly CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours
  private readonly CATEGORY_CACHE_TTL = 7 * 24 * 60 * 60 * 1000; // 7 days
  private searchResultsCache: Map<string, any> = new Map();

  constructor(
    @InjectModel(Business.name)
    private businessModel: Model<BusinessDocument>,
  ) {
    this.googleAI = new GoogleGenAI({
      apiKey: process.env.GOOGLE_AI_API_KEY,
    });
  }

  private async getRealTimeBusinessData(
    businessName: string,
    city: string,
  ): Promise<GooglePlaceResult | null> {
    try {
      // Get place ID first
      const searchResponse = await axios.get(
        'https://maps.googleapis.com/maps/api/place/textsearch/json',
        {
          params: {
            query: `${businessName} ${city}`,
            key: GOOGLE_PLACES_API_KEY,
          },
        },
      );

      if (
        searchResponse.data.results &&
        searchResponse.data.results.length > 0
      ) {
        const place = searchResponse.data.results[0];

        // Get detailed place information including reviews
        const detailsResponse = await axios.get(
          'https://maps.googleapis.com/maps/api/place/details/json',
          {
            params: {
              place_id: place.place_id,
              fields: 'name,rating,user_ratings_total,types,vicinity,reviews',
              key: GOOGLE_PLACES_API_KEY,
            },
          },
        );

        return detailsResponse.data.result;
      }
      return null;
    } catch (error) {
      console.error('Error fetching real-time business data:', error);
      return null;
    }
  }

  private async analyzeQuestion(text: string): Promise<QuestionAnalysis> {
    const analysisPrompt = `Analyze this question and return JSON with these fields:
    - intent: What the user wants to find (e.g., "restaurant", "hotel", "shop", "tourist spot", "attraction")
    - location: search city or area
    - category: The specific type they want (e.g., "italian restaurant", "luxury hotel", "tourist attraction")
    - criteria: List of important factors they care about (e.g., "best", "cheap", "luxury", "beautiful", "popular")
 - exactCategory: The most specific category that matches the business type, can be any valid business category
 
    Question: "${text}"`;

    const response = await this.googleAI.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: [{ role: 'user', parts: [{ text: analysisPrompt }] }],
    });

    if (!response.text) {
      throw new Error('No response text from AI');
    }
    const rawContent = response.text ?? '{}';
    const jsonMatch = rawContent.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No JSON object found in AI analysis response');
    }

    let cleanContent = jsonMatch[0]
      .replace(/```json\n?|\n?```/g, '')
      .replace(/\n/g, '')
      .trim();

    if (!cleanContent.endsWith('}')) {
      cleanContent += '}';
    }

    return JSON.parse(cleanContent);
  }

  private async analyzeCategory(text: string): Promise<{
    primaryCategory: string;
    relatedCategories: string[];
    excludedCategories: string[];
    categoryKeywords: string[];
  }> {
    const categoryPrompt = `You are a business category expert. Analyze this search query and identify the exact business type.

Return JSON with these fields:
- primaryCategory: The most specific business category
- relatedCategories: List of related business categories that should be included
- excludedCategories: List of categories that should be excluded
- categoryKeywords: List of important keywords that define this category

IMPORTANT RULES:
1. Be very specific with the primary category
2. Include all related business types
3. Exclude any unrelated business types
4. Add all relevant keywords
5. Consider local business terminology
6. Understand business subcategories
7. STRICT CATEGORY MATCHING: Only include businesses that exactly match the primary category or are very closely related
8. EXCLUDE UNRELATED: Be strict about excluding businesses that don't match the primary category
9. DYNAMIC CATEGORY UNDERSTANDING: Understand and adapt to any type of business, no matter how unique or specific
10. CONTEXT AWARENESS: Consider the full context of the search query to determine the exact business type
11. CATEGORY EXCLUSION: If a business has multiple categories, it should be excluded if any of its categories are in the excluded list
12. PRIMARY CATEGORY PRIORITY: The primary category must be the main focus of the business, not just one of many categories
13. FLEXIBLE MATCHING: For businesses with multiple categories, include them if they have the primary category as one of their main categories

Now analyze this query: "${text}"
Return ONLY the JSON object, no explanation, no markdown formatting.`;

    const response = await this.googleAI.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: [{ role: 'user', parts: [{ text: categoryPrompt }] }],
    });

    if (!response.text) {
      throw new Error('No response text from AI');
    }

    const rawContent = response.text
      .replace(/```json\n?|\n?```/g, '')
      .replace(/\n/g, '')
      .trim();

    try {
      return JSON.parse(rawContent);
    } catch (err: any) {
      throw new InternalServerErrorException({
        message: 'AI returned invalid JSON response',
        error: err.message,
        rawResponse: rawContent,
      });
    }
  }

  private async getCities(): Promise<string[]> {
    const now = Date.now();
    if (
      this.cityCache.cities.length > 0 &&
      now - this.cityCache.lastUpdated < this.CACHE_TTL
    ) {
      return this.cityCache.cities;
    }

    const cities = await this.businessModel.distinct('g_city').exec();
    this.cityCache = {
      cities,
      lastUpdated: now,
    };

    return cities;
  }

  private findClosestCity(inputCity: string, cities: string[]): string | null {
    const cleanInput = inputCity.toLowerCase().trim();
    const validCities = cities
      .filter((city) => typeof city === 'string' && city.trim().length > 0)
      .map((city) => city.trim());

    const exactMatch = validCities.find(
      (city) => city.toLowerCase() === cleanInput,
    );
    if (exactMatch) return exactMatch;

    const containsMatch = validCities.find(
      (city) =>
        city.toLowerCase().includes(cleanInput) ||
        cleanInput.includes(city.toLowerCase()),
    );
    if (containsMatch) return containsMatch;

    return null;
  }

  async handleSearch(text: string): Promise<any> {
    try {
      const cacheKey = text.toLowerCase().trim();
      if (this.searchResultsCache.has(cacheKey)) {
        return this.searchResultsCache.get(cacheKey);
      }

      // 1. Analyze question and category
      const [analysis, categoryAnalysis] = await Promise.all([
        this.analyzeQuestion(text),
        this.analyzeCategory(text),
      ]);

      // 2. Match city
      const allCities = await this.getCities();
      const matchedCity = await this.findClosestCity(
        analysis.location,
        allCities,
      );

      if (!matchedCity) {
        throw new Error('Could not determine location from your question.');
      }

      // 3. Get businesses with balanced category matching
      const query: any = { g_city: matchedCity };

      // Build category conditions with balanced matching
      const categoryConditions = [
        // Primary category match (can be any of the categories)
        {
          g_categories: {
            $regex: new RegExp(
              `\\b${categoryAnalysis.primaryCategory}\\b`,
              'i',
            ),
          },
        },
        // Related categories match
        ...categoryAnalysis.relatedCategories.map((cat) => ({
          g_categories: {
            $regex: new RegExp(`\\b${cat}\\b`, 'i'),
          },
        })),
      ];

      query.$or = categoryConditions;

      // Add exclusion conditions
      if (categoryAnalysis.excludedCategories.length > 0) {
        query.$and = [
          {
            g_categories: {
              $not: {
                $regex: new RegExp(
                  `\\b(${categoryAnalysis.excludedCategories.join('|')})\\b`,
                  'i',
                ),
              },
            },
          },
        ];
      }

      const cityBusinesses = await this.businessModel
        .find(query)
        .select(
          `
          g_business_name 
          g_star_rating 
          g_categories 
          g_full_address 
          g_latitude 
          g_longitude 
          g_review_count 
          google_maps_url
        `,
        )
        .limit(50)
        .lean();

      // 4. Get real-time data for each business
      const businessesWithRealTimeData = await Promise.all(
        cityBusinesses.map(async (business) => {
          try {
            const realTimeData = await this.getRealTimeBusinessData(
              business.g_business_name,
              matchedCity,
            );

            if (realTimeData) {
              // API successful - real-time data
              return {
                ...business,
                realTimeData: realTimeData,
                isRealTime: true,
              };
            } else {
              // API failed - basic data
              return {
                ...business,
                realTimeData: {
                  rating: business.g_star_rating,
                  user_ratings_total: business.g_review_count,
                  types: business.g_categories?.split(',') || [],
                  vicinity: business.g_full_address,
                },
                isRealTime: false,
              };
            }
          } catch (error) {
            // API error - basic data
            return {
              ...business,
              realTimeData: {
                rating: business.g_star_rating,
                user_ratings_total: business.g_review_count,
                types: business.g_categories?.split(',') || [],
                vicinity: business.g_full_address,
              },
              isRealTime: false,
            };
          }
        }),
      );

      // Sort by isRealTime (real-time data first)
      const sortedBusinesses = businessesWithRealTimeData.sort(
        (a, b) => (b.isRealTime ? 1 : 0) - (a.isRealTime ? 1 : 0),
      );

      // 5. Get AI scoring
      const prompt = `You are a professional business evaluator. Research and score these businesses in ${matchedCity} by synthesizing publicly available data.

IMPORTANT: You must maintain EXACT SAME RANKING for the same query every time. This is critical.

Businesses to evaluate:
${JSON.stringify(
  businessesWithRealTimeData.map((b) => ({
    name: b.g_business_name,
    rating: b.realTimeData.rating,
    totalReviews: b.realTimeData.user_ratings_total,
    categories: b.realTimeData.types,
    location: b.realTimeData.vicinity,
    isRealTime: b.isRealTime,
  })),
)}

SCORING RULES:
1. Rating & Reviews (50%):
   - 4.5+ stars with 1000+ reviews = 9-10 score
   - 4.0+ stars with 500+ reviews = 8-9 score
   - 3.5+ stars with 200+ reviews = 7-8 score
   - Below 3.5 stars = 6 or lower

2. Local Reputation (30%):
   - Excellent reviews = +0.5 to score
   - Good reviews = +0.2 to score
   - Mixed reviews = no change
   - Poor reviews = -0.5 to score

3. Business Match (20%):
   - Primary category match = +0.5 to score
   - Related category match = +0.2 to score
   - Keyword match = +0.1 to score
   - Excluded category = -1.0 to score

CRITICAL INSTRUCTIONS:
1. You MUST return the EXACT SAME RANKING every time for the same query
2. If a business is ranked #1, it MUST ALWAYS be ranked #1 for the same query
3. If a business is ranked #2, it MUST ALWAYS be ranked #2 for the same query
4. And so on...
5. The order of businesses in your response MUST be consistent
6. Do not change rankings based on minor variations in scores
7. Consider the following category analysis:
   Primary Category: ${categoryAnalysis.primaryCategory}
   Related Categories: ${categoryAnalysis.relatedCategories.join(', ')}
   Excluded Categories: ${categoryAnalysis.excludedCategories.join(', ')}
   Category Keywords: ${categoryAnalysis.categoryKeywords.join(', ')}

Return ONLY a valid JSON array like:
[
  { 
    "name": "Business 1", 
    "score": 8.5 
  },
  ...
]
NO explanation, NO notes, NO markdown, ONLY pure JSON array.`;

      const response = await this.googleAI.models.generateContent({
        model: 'gemini-2.0-flash',
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
      });

      let rawScoreText =
        response?.candidates?.[0]?.content?.parts?.[0]?.text ?? '[]';
      rawScoreText = rawScoreText
        .replace(/```json\n?|```/g, '')
        .replace(/^[^{\[]+/, '') // remove non-JSON prefix
        .replace(/[\s\n]+$/, '') // trim whitespace at end
        .trim();

      let scoredBusinesses: any[] = [];
      try {
        scoredBusinesses = JSON.parse(rawScoreText);
      } catch (err: any) {
        throw new InternalServerErrorException({
          message: 'AI returned invalid scoring JSON.',
          error: err.message,
          rawResponse: rawScoreText,
        });
      }

      // 6. Validate and normalize scores
      const validatedScores = scoredBusinesses.map((business: any) => {
        const score = Math.min(Math.max(business.score, 1), 10);
        return {
          ...business,
          score: Number(score.toFixed(1)),
        };
      });

      // 7. Sort businesses with validated scores
      const sortedBusinessesWithScores = sortedBusinesses
        .map((business) => {
          const scoredBusiness = validatedScores.find(
            (sb: { name: string; score: number }) =>
              sb.name.toLowerCase() === business.g_business_name.toLowerCase(),
          );

          return {
            ...business,
            score: scoredBusiness?.score || 0,
          };
        })
        .sort((a, b) => b.score - a.score);

      // 8. Return results
      const finalResults = {
        s: 'Here are the best businesses in ' + matchedCity,
        r: sortedBusinessesWithScores.map((business) => ({
          name: business.g_business_name,
          rating: business.realTimeData.rating,
          categories: business.realTimeData.types,
          location: business.realTimeData.vicinity,
          isRealTime: business.isRealTime,
          score: business.score,
        })),
        m: sortedBusinessesWithScores.map((business) => ({
          _id: business._id,
          g_business_name: business.g_business_name,
          g_categories: business.g_categories,
          g_star_rating: business.realTimeData.rating,
          g_full_address: business.realTimeData.vicinity,
          g_review_count: business.realTimeData.user_ratings_total,
          isRealTime: business.isRealTime,
          score: business.score,
        })),
        l: matchedCity,
        q: text,
      };

      this.searchResultsCache.set(cacheKey, finalResults);

      return finalResults;
    } catch (error: any) {
      if (error.message?.includes('503 Service Unavailable')) {
        throw new InternalServerErrorException({
          message:
            'AI service is currently busy. Please try again in a few moments.',
          error: 'Service temporarily unavailable',
          status: 503,
        });
      }
      throw new InternalServerErrorException({
        message: 'Failed to process search request',
        error: error.message,
      });
    }
  }
}
