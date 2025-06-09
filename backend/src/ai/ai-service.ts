import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel, raw } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { GoogleGenAI } from '@google/genai';
// import { Business, BusinessDocument } from 'business/business.schema';
import {
  BusinessProfile,
  BusinessProfileDocument,
} from 'business-profile/business.profile.schema';

interface QuestionAnalysis {
  intent: string;
  location: string;
  category: string;
  criteria: string[];
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
  private readonly CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
  private readonly CATEGORY_CACHE_TTL = 7 * 24 * 60 * 60 * 1000; // 7 days for categories

  constructor(
    @InjectModel(BusinessProfile.name)
    private businessModel: Model<BusinessProfileDocument>,
  ) {
    this.googleAI = new GoogleGenAI({
      apiKey: process.env.GOOGLE_AI_API_KEY,
    });
  }

  private async getCategories(): Promise<string[]> {
    const now = Date.now();

    // Return cached categories if cache is still valid
    if (
      this.categoryCache.categories.length > 0 &&
      now - this.categoryCache.lastUpdated < this.CATEGORY_CACHE_TTL
    ) {
      return this.categoryCache.categories;
    }

    // Get fresh categories from database
    // We might get multiple categories per business, need to split and flatten
    const rawCategories = await this.businessModel
      .distinct('g_categories')
      .exec();
    const categories = Array.from(
      new Set(
        rawCategories
          .filter((cat) => typeof cat === 'string') // Ensure it's a string
          .flatMap((cat) => cat.split(',')) // Split by comma
          .map((cat) => cat.trim()) // Trim whitespace
          .filter((cat) => cat.length > 0), // Remove empty strings
      ),
    );

    // Update cache
    this.categoryCache = {
      categories,
      lastUpdated: now,
    };

    return categories;
  }

  private async getCities(): Promise<string[]> {
    const now = Date.now();

    // Return cached cities if cache is still valid
    if (
      this.cityCache.cities.length > 0 &&
      now - this.cityCache.lastUpdated < this.CACHE_TTL
    ) {
      return this.cityCache.cities;
    }

    // Get fresh cities from database
    const cities = await this.businessModel.distinct('g_city').exec();

    // Update cache
    this.cityCache = {
      cities,
      lastUpdated: now,
    };

    return cities;
  }

  private findClosestCity(inputCity: string, cities: string[]): string | null {
    const cleanInput = inputCity.toLowerCase().trim();

    // Filter out non-string values and normalize cities
    const validCities = cities
      .filter((city) => typeof city === 'string' && city.trim().length > 0)
      .map((city) => city.trim());

    // First try exact match (fastest)
    const exactMatch = validCities.find(
      (city) => city.toLowerCase() === cleanInput,
    );
    if (exactMatch) return exactMatch;

    // Then try contains match (still fast)
    const containsMatch = validCities.find(
      (city) =>
        city.toLowerCase().includes(cleanInput) ||
        cleanInput.includes(city.toLowerCase()),
    );
    if (containsMatch) return containsMatch;

    // Finally try similarity match (slowest, but only if needed)
    const similarityMatch = validCities.find(async (city) => {
      const similarity = await this.calculateSimilarity(
        cleanInput,
        city.toLowerCase(),
      );
      return similarity > 0.7; // 70% similarity threshold
    });

    return similarityMatch || null;
  }

  private async analyzeQuestion(text: string): Promise<QuestionAnalysis> {
    const analysisPrompt = `Analyze this question and return JSON with these fields:
    - intent: What the user wants to find (e.g., "restaurant", "hotel", "shop")
    - location: search city or area
    Question: "${text}"`;

    const response = await this.googleAI.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: [{ role: 'user', parts: [{ text: analysisPrompt }] }],
    });

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

  async handleSearch(text: string): Promise<any> {
    try {
      // 1. Just get location from the question
      const analysis = await this.analyzeQuestion(text);
      const allCities = await this.getCities();
      const matchedCity = await this.findClosestCity(analysis.location, allCities);

      if (!matchedCity) {
        throw new Error('Could not determine location from your question.');
      }

      // 2. Create AI prompt for pure research-based assessment
      const prompt = `You are a professional business evaluator. Your task is to provide a comprehensive search-based scoring assessment for all places in "${matchedCity}" based on their online presence, review count, and average ratings.

      Please:
      1. Search for all relevant businesses in ${matchedCity}
      2. Research each business's:
         - Current online presence
         - Review counts from various platforms
         - Average ratings
         - Recent review activity
         - Overall reputation

      Score each business using this system:

      1. Online Presence (40% of total):
         - Review Count:
           * 1000+ reviews: 10 points
           * 500-999 reviews: 8 points
           * 100-499 reviews: 6 points
           * 50-99 reviews: 4 points
           * <50 reviews: 2 points

      2. Rating Score (40% of total):
         - Average Rating:
           * 4.5-5.0 stars: 10 points
           * 4.0-4.4 stars: 8 points
           * 3.5-3.9 stars: 6 points
           * 3.0-3.4 stars: 4 points
           * <3.0 stars: 2 points

      3. Review Quality (20% of total):
         - Based on:
           * Recent review activity
           * Review diversity
           * Review sentiment

      Return results in this format:
      [
        {
          "name": "Business Name",
          "totalScore": 8.5,
          "research": {
            "onlinePresence": {
              "score": 8,
              "reviewCount": 500,
              "platforms": ["Google", "Yelp", "TripAdvisor"],
              "strength": "High/Medium/Low"
            },
            "ratings": {
              "score": 9,
              "averageRating": 4.5,
              "ratingSources": ["Google", "Yelp", "TripAdvisor"],
              "quality": "Excellent/Good/Average/Poor"
            },
            "reviewQuality": {
              "score": 8,
              "recentActivity": "High/Medium/Low",
              "diversity": "High/Medium/Low",
              "sentiment": "Positive/Mixed/Negative"
            }
          },
          "summary": "Brief explanation of the overall assessment",
          "lastUpdated": "Current date of research"
        }
      ]`;

      // 3. Get AI response
      const response = await this.googleAI.models.generateContent({
        model: 'gemini-2.0-flash',
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
      });

      // 4. Parse results
      const results = JSON.parse(
        (response?.candidates?.[0]?.content?.parts?.[0]?.text ?? '[]')
          .replace(/```json\n?|\n?```/g, '')
          .trim()
      );

      // 5. Sort results by total score
      const sortedResults = results.sort((a: any, b: any) => b.totalScore - a.totalScore);

      // 6. Return formatted results
      return {
        s: `AI-based business assessment for ${matchedCity}`,
        r: sortedResults.map((business: any) => ({
          name: business.name,
          totalScore: business.totalScore,
          research: business.research,
          summary: business.summary,
          lastUpdated: business.lastUpdated
        })),
        l: matchedCity,
        q: text
      };

    } catch (error: any) {
      if (error.message && error.message.includes('503 Service Unavailable')) {
        throw new InternalServerErrorException({
          message: 'AI service is currently busy. Please try again in a few moments.',
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

  private async calculateSimilarity(
    str1: string,
    str2: string,
  ): Promise<number> {
    const longer = str1.length > str2.length ? str1 : str2;
    const shorter = str1.length > str2.length ? str2 : str1;

    if (longer.length === 0) return 1.0;

    // Fetch categories to use for removing general category terms
    const allCategories = await this.getCategories();
    // Create a regex from categories that are longer than a few characters
    const categoryRegex = new RegExp(
      allCategories
        .filter((cat) => cat.length > 3)
        .map((cat) => cat.replace(/[\W_]+/g, '\\W*')) // Escape special characters and allow non-alphanumeric
        .join('|'),
      'gi',
    );

    // Remove general category terms using the generated regex
    const cleanStr1 = str1.replace(categoryRegex, '').trim();
    const cleanStr2 = str2.replace(categoryRegex, '').trim();

    // Calculate similarity on cleaned strings
    return (
      (longer.length - this.editDistance(cleanStr1, cleanStr2)) / longer.length
    );
  }

  private calculateSimilaritySync(str1: string, str2: string): number {
    const longer = str1.length > str2.length ? str1 : str2;
    const shorter = str1.length > str2.length ? str2 : str1;

    if (longer.length === 0) return 1.0;

    // We cannot fetch categories synchronously here.
    // For synchronous similarity checks, we'll use a basic approach
    // or pre-fetch and store a set of category words to remove if needed.
    // For now, keeping it simple without dynamic category removal in sync version.

    // Calculate similarity
    return (longer.length - this.editDistance(str1, str2)) / longer.length;
  }

  private editDistance(str1: string, str2: string): number {
    const matrix = Array(str2.length + 1)
      .fill(null)
      .map(() => Array(str1.length + 1).fill(null));

    for (let i = 0; i <= str1.length; i++) matrix[0][i] = i;
    for (let j = 0; j <= str2.length; j++) matrix[j][0] = j;

    for (let j = 1; j <= str2.length; j++) {
      for (let i = 1; i <= str1.length; i++) {
        const substitutionCost = str1[i - 1] === str2[j - 1] ? 0 : 1;
        matrix[j][i] = Math.min(
          matrix[j][i - 1] + 1, // deletion
          matrix[j - 1][i] + 1, // insertion
          matrix[j - 1][i - 1] + substitutionCost, // substitution
        );
      }
    }

    return matrix[str2.length][str1.length];
  }
}
