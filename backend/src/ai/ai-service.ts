import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel, raw } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { GoogleGenAI } from '@google/genai';
import { Business, BusinessDocument } from 'business/business.schema';

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
    @InjectModel(Business.name)
    private businessModel: Model<BusinessDocument>,
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
    - intent: What the user wants to find (e.g., "restaurant", "hotel", "shop", "tourist spot", "attraction")
    - location: search city or area
    - category: The specific type they want (e.g., "italian restaurant", "luxury hotel", "tourist attraction")
    - criteria: List of important factors they care about (e.g., "best", "cheap", "luxury", "beautiful", "popular")
    - context: Additional context or preferences mentioned
    Question: "${text}"`;

    const response = await this.googleAI.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: [{ role: 'user', parts: [{ text: analysisPrompt }] }],
    });

    const rawContent = response.text ?? '{}';

    console.log({ rawContent });
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
      // 1. First analyze the question to understand user intent
      const analysis = await this.analyzeQuestion(text);
      console.log('Question Analysis:', analysis);

      // 2. Get cities from cache and find match
      const allCities = await this.getCities();
      const matchedCity = await this.findClosestCity(
        analysis.location,
        allCities,
      );

      if (!matchedCity) {
        throw new Error('Could not determine location from your question.');
      }

      // 3. Get businesses for matched city with category filter if available
      const query: any = { g_city: matchedCity };

      // Create a more flexible search condition
      const searchTerms = analysis.category.toLowerCase().split(/\s+/);
      query.$or = [
        // Exact name match
        {
          g_business_name: {
            $regex: new RegExp(`^${analysis.category}$`, 'i'),
          },
        },
        // Category match
        { g_categories: { $regex: new RegExp(searchTerms.join('|'), 'i') } },
        // Partial name match
        { g_business_name: { $regex: new RegExp(searchTerms.join('|'), 'i') } },
      ];

      const cityBusinesses = await this.businessModel
        .find(query)
        .select('g_business_name g_star_rating g_categories')
        .limit(500)
        .lean();

      // Sort businesses by match type
      const sortedBusinesses = cityBusinesses.sort((a, b) => {
        const aName = (a.g_business_name || '').toLowerCase();
        const bName = (b.g_business_name || '').toLowerCase();
        const searchTerm = analysis.category.toLowerCase();

        // Exact name match gets highest priority
        const aExactMatch = aName === searchTerm;
        const bExactMatch = bName === searchTerm;
        if (aExactMatch && !bExactMatch) return -1;
        if (!aExactMatch && bExactMatch) return 1;

        // Category match gets second priority
        const aCategories = (a.g_categories || '').toLowerCase().split(',');
        const bCategories = (b.g_categories || '').toLowerCase().split(',');
        const aCategoryMatch = aCategories.some((cat) =>
          cat.includes(searchTerm),
        );
        const bCategoryMatch = bCategories.some((cat) =>
          cat.includes(searchTerm),
        );
        if (aCategoryMatch && !bCategoryMatch) return -1;
        if (!aCategoryMatch && bCategoryMatch) return 1;

        // Partial name match gets third priority
        const aPartialMatch = aName.includes(searchTerm);
        const bPartialMatch = bName.includes(searchTerm);
        if (aPartialMatch && !bPartialMatch) return -1;
        if (!aPartialMatch && bPartialMatch) return 1;
        // If all else is equal, sort by rating
        return Number(b.g_star_rating || 0) - Number(a.g_star_rating || 0);
      });

      // Add logging to see what businesses we're getting
      console.log(
        'Found businesses:',
        sortedBusinesses.map((b) => ({
          name: b.g_business_name,
          categories: b.g_categories,
        })),
      );

      if (sortedBusinesses.length === 0) {
        throw new Error(
          `No businesses found in ${matchedCity}. Please try a different location or search term.`,
        );
      }

      if (sortedBusinesses.length < 10) {
        console.warn(
          `Only ${sortedBusinesses.length} businesses found in ${matchedCity}. AI might not perform optimally.`,
        );
      }

      // 4. Create minimal business data with analysis context
      const businessData = sortedBusinesses.slice(0, 50).map((business) => {
        // Split categories and clean them
        const categories = (business.g_categories || '')
          .split(',')
          .map((cat) => cat.trim())
          .filter((cat) => cat.length > 0);

        return {
          n: business.g_business_name?.substring(0, 50) ?? '',
          r: business.g_star_rating ?? 0,
          c: categories, // Send all categories to AI
        };
      });

      console.log({ businessData });

      // 5. Create enhanced prompt with analysis context
      const prompt = `You are a precise business recommendation system. Return businesses that match the user's search criteria:

1. Category Matching:
   - User is looking for: ${analysis.category}
   - Match businesses if ANY of these conditions are met:
     * Business name contains the category keywords
     * Business categories contain the category keywords
     * Business categories are related to the requested category
   - For "sport store" example:
     * Match: "Sports memorabilia store", "Sportswear store", "Sports equipment"
     * Match: Business names containing "sport", "sports", "athletic"
   - For any category:
     * Look for exact matches
     * Look for partial matches
     * Look for related categories

2. Location Matching:
   - Must be in: ${matchedCity}
   - No exceptions for location

3. Business Data Analysis:
   - Check both business name and categories
   - Consider partial matches in categories
   - Consider related categories
   - Then consider rating and popularity

Return a JSON object with this structure:
{ 
  "results": [
    {
      "name": "Business Name",
      "rating": 4.5,
      "category": "Category Name",
      "matchReason": "Category match: [category]"
    }
  ]
}

Business data to analyze: ${JSON.stringify(businessData)}

IMPORTANT: 
- Look for both exact and partial category matches
- Consider business names containing category keywords
- Consider related categories
- Return ONLY the JSON object, no additional text.`;

      // 6. Get AI response
      const response = await this.googleAI.models.generateContent({
        model: 'gemini-2.0-flash',
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
      });

      // 7. Process response
      const rawContent = response.text ?? '{}';
      console.log('Raw AI Response:', rawContent);

      // Add more detailed logging of the raw content
      console.log('Raw content length:', rawContent.length);
      console.log('First 100 characters:', rawContent.substring(0, 100));

      // Match either an object or array
      const jsonMatch = rawContent.match(/(\{[\s\S]*\}|\[[\s\S]*\])/);
      if (!jsonMatch) {
        console.error(
          'No JSON object/array found in response. Raw content:',
          rawContent,
        );
        throw new Error('No JSON object/array found in AI response');
      }

      let cleanContent = jsonMatch[0]
        .replace(/```json\n?|\n?```/g, '') // Remove JSON code blocks
        .replace(/\n/g, '') // Remove newlines
        .replace(/,\s*}/g, '}') // Remove trailing commas
        .replace(/,\s*]/g, ']') // Remove trailing commas in arrays
        .trim();

      // Add logging of the cleaned content before parsing
      console.log('Cleaned content before parsing:', cleanContent);
      console.log('Cleaned content length:', cleanContent.length);

      try {
        const result = JSON.parse(cleanContent);
        console.log('Parsed Result:', result);

        // 8. Transform the AI response into the expected format
        // Handle both array and object responses
        const businessList: {
          name: string;
          rating?: number;
          category?: string;
        }[] = Array.isArray(result)
          ? result.map((business: any) => ({
              name: business.name || business.n,
              rating: business.rating || business.r,
              category: business.category || business.c,
            }))
          : (result.results || result.B || []).map((business: any) => ({
              name: business.name || business.n,
              rating: business.rating || business.r,
              category: business.category || business.c,
            }));

        // Add this log to inspect businessList after parsing
        console.log('Populated businessList after parsing:', businessList);

        // 9. Match with database - Improved matching logic using categories
        const matchedResults = (
          await Promise.all(
            businessList.map(async (business) => {
              console.log(
                'Trying to match:',
                business.name,
                'Category:',
                business.category,
              );

              const matchedBusiness = sortedBusinesses.find((dbBusiness) => {
                const dbName = (dbBusiness.g_business_name || '')
                  .toLowerCase()
                  .trim();
                const aiName = (business.name || '').toLowerCase().trim();
                const dbCategories = (dbBusiness.g_categories || '')
                  .toLowerCase()
                  .split(',')
                  .map((cat) => cat.trim())
                  .filter((cat) => cat.length > 0);

                // Handle both string and array categories from AI response
                const aiCategories = Array.isArray(business.category)
                  ? business.category.map((cat) =>
                      (cat || '').toLowerCase().trim(),
                    )
                  : [(business.category || '').toLowerCase().trim()];

                // More strict matching conditions
                const isMatch =
                  // Exact name match (highest priority)
                  dbName === aiName ||
                  // Very close name match with high similarity threshold
                  this.calculateSimilaritySync(dbName, aiName) > 0.85 ||
                  // Category match with exact name match
                  (aiCategories.some((aiCat) => dbCategories.includes(aiCat)) &&
                    (dbName.includes(aiName) || aiName.includes(dbName)));

                if (isMatch) {
                  console.log('Found match:', {
                    dbName,
                    aiName,
                    dbCategories,
                    aiCategories,
                    similarity: this.calculateSimilaritySync(dbName, aiName),
                  });
                }

                return isMatch;
              });

              if (!matchedBusiness) {
                console.log('No match found for:', business.name);
              }

              return matchedBusiness ? { ...matchedBusiness } : null;
            }),
          )
        )
          .filter((business): business is NonNullable<typeof business> =>
            Boolean(business),
          )
          .filter(
            (business, index, self) =>
              index === self.findIndex((b) => b._id === business._id),
          );

        // 10. Return results with proper structure
        return {
          s: 'Here are the best businesses in ' + matchedCity,
          r: matchedResults.map((business) => {
            // Split categories and clean them
            const categories = (business.g_categories || '')
              .split(',')
              .map((cat) => cat.trim())
              .filter((cat) => cat.length > 0);

            return {
              name: business.g_business_name,
              rating: business.g_star_rating,
              categories: categories, // Return all categories
            };
          }),
          m: matchedResults.map((business) => ({
            ...business,
            g_categories: business.g_categories, // Keep original categories string
          })),
          l: matchedCity,
          q: text,
        };
      } catch (error: any) {
        console.error('Error parsing JSON:', error);
        throw new Error('Failed to parse JSON response');
      }
    } catch (error: any) {
      if (error.message && error.message.includes('503 Service Unavailable')) {
        throw new InternalServerErrorException({
          message:
            'AI service is currently busy. Please try again in a few moments.',
          error: 'Service temporarily unavailable',
          status: 503,
        });
      }

      console.error('Error processing search request:', error);

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
