import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import OpenAI from 'openai';
import { GoogleGenAI } from '@google/genai';
import {
  BusinessProfile,
  BusinessProfileDocument,
} from 'business-profile/business.profile.schema';

@Injectable()
export class AiService {
  // private openai: OpenAI;
  private googleAI: GoogleGenAI;

  constructor(
    @InjectModel(BusinessProfile.name)
    private businessModel: Model<BusinessProfileDocument>,
  ) {
    // Previous OpenAI setup (commented)
    /*
    this.openai = new OpenAI({
      baseURL: "https://openrouter.ai/api/v1",
      apiKey: "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"
    });
    */

    // New Google AI setup
    this.googleAI = new GoogleGenAI({
      apiKey: 'AIzaSyBkunWP4l4SVzCSbaP_oVNHrXO9OI_R33k', // Replace with your actual API key
    });
  }

  async processSearchText(text: string) {
    const prompt = `Analyze this search: "${text}"
Return a JSON object with EXACTLY this structure:
{
  "summary": "brief summary",
  "categories": ["category1", "category2"],
  "location": "location name"
}
No other text or formatting allowed.`;

    // Previous OpenAI implementation (commented)
    /*
    const completion = await this.openai.chat.completions.create({
      model: "meta-llama/llama-4-scout:free",
      messages: [
        { 
          role: 'system', 
          content: 'You are a JSON-only response bot. You must return a valid JSON object with exactly these fields: summary (string), categories (string array), and location (string). No other text or formatting allowed.' 
        },
        { role: 'user', content: prompt },
      ],
      temperature: 0.1
    });
    */

    // New Google AI implementation
    const response = await this.googleAI.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: `You are a JSON-only response bot. You must return a valid JSON object with exactly these fields: summary (string), categories (string array), and location (string). No other text or formatting allowed.

Analyze this search: "${text}"
Return a JSON object with EXACTLY this structure:
{
  "summary": "brief summary",
  "categories": ["category1", "category2"],
  "location": "location name"
}
No other text or formatting allowed.`,
            },
          ],
        },
      ],
    });

    try {
      // Previous OpenAI response handling (commented)
      /*
      const rawContent = completion.choices[0]?.message?.content ?? '{}';
      */

      // New Google AI response handling
      const rawContent = response.text ?? '{}';
      console.log('Raw AI response:', rawContent);

      // Clean the response
      let cleanContent = rawContent
        .replace(/```json\n?|\n?```/g, '') // Remove markdown code blocks
        .replace(/\n/g, '') // Remove newlines
        .trim();

      // Ensure the JSON is properly closed
      if (!cleanContent.endsWith('}')) {
        cleanContent += '}';
      }

      const result = JSON.parse(cleanContent);

      // Validate required fields
      if (
        !result.location ||
        !result.categories ||
        !Array.isArray(result.categories)
      ) {
        throw new Error('Missing required fields in AI response');
      }

      return result;
    } catch (error) {
      console.error('Error parsing AI response:', error);
      throw new Error('Failed to parse AI response as JSON');
    }
  }

  async handleSearch(text: string) {
    try {
      const processedResult = await this.processSearchText(text);
      const { summary, categories, location } = processedResult;

      if (!location) {
        throw new Error('Could not determine location from your question.');
      }

      // Get all unique cities and categories from database
      const allCities = await this.businessModel.distinct('g_city');
      const allCategories = await this.businessModel.distinct('g_categories');
      const matchedCity = this.findClosestCity(location, allCities);

      console.log('Input city:', location, 'Matched to:', matchedCity);

      if (!matchedCity) {
        throw new Error(`No matching city found for "${location}"`);
      }

      // Find similar categories
      const matchedCategories = categories
        .map((cat: string) => this.findClosestCategory(cat, allCategories))
        .filter(Boolean);

      console.log(
        'Input categories:',
        categories,
        'Matched to:',
        matchedCategories,
      );

      // Search with matched categories
      const results = await this.businessModel
        .find({
          g_city: matchedCity,
          g_categories: {
            $in: matchedCategories,
          },
        })
        .limit(50);

      if (results.length > 0) {
        console.log('Found matches:', results.length);
        return {
          summary,
          results,
          location: matchedCity,
        };
      }

      // If no results, try location only
      console.log('No category matches, trying location only');
      const locationResults = await this.businessModel
        .find({
          g_city: matchedCity,
        })
        .limit(50);

      if (locationResults.length) {
        console.log('Found results by location only:', locationResults.length);
        return {
          summary,
          results: locationResults,
          location: matchedCity,
        };
      }

      throw new Error('No matching locations found.');
    } catch (error) {
      console.error('Error in handleSearch:', error);
      throw new InternalServerErrorException(
        'Failed to process search request',
      );
    }
  }

  private findClosestCity(inputCity: string, cities: string[]): string | null {
    const cleanInput = inputCity.toLowerCase().trim();

    // First try exact match
    const exactMatch = cities.find((city) => city.toLowerCase() === cleanInput);
    if (exactMatch) return exactMatch;

    // Then try contains match
    const containsMatch = cities.find(
      (city) =>
        city.toLowerCase().includes(cleanInput) ||
        cleanInput.includes(city.toLowerCase()),
    );
    if (containsMatch) return containsMatch;

    // Finally try similarity match (if input is close to a city name)
    const similarityMatch = cities.find((city) => {
      const similarity = this.calculateSimilarity(
        cleanInput,
        city.toLowerCase(),
      );
      return similarity > 0.7; // 70% similarity threshold
    });

    return similarityMatch || null;
  }

  private findClosestCategory(
    inputCategory: string,
    categories: string[],
  ): string | null {
    const cleanInput = inputCategory.toLowerCase().trim();

    // First try exact match
    const exactMatch = categories.find(
      (cat) => cat.toLowerCase() === cleanInput,
    );
    if (exactMatch) return exactMatch;

    // Then try contains match
    const containsMatch = categories.find(
      (cat) =>
        cat.toLowerCase().includes(cleanInput) ||
        cleanInput.includes(cat.toLowerCase()),
    );
    if (containsMatch) return containsMatch;

    // Finally try similarity match
    const similarityMatch = categories.find((cat) => {
      const similarity = this.calculateSimilarity(
        cleanInput,
        cat.toLowerCase(),
      );
      return similarity > 0.7; // 70% similarity threshold
    });

    return similarityMatch || null;
  }

  private calculateSimilarity(str1: string, str2: string): number {
    const longer = str1.length > str2.length ? str1 : str2;
    const shorter = str1.length > str2.length ? str2 : str1;

    if (longer.length === 0) return 1.0;

    return (longer.length - this.editDistance(longer, shorter)) / longer.length;
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
