import { Injectable, InternalServerErrorException } from '@nestjs/common';
import axios from 'axios';
import { BusinessEntity } from '../business/business.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class AiService {
  constructor(

    @InjectRepository(BusinessEntity)
    private businessRepository: Repository<BusinessEntity>,
  ) {}

  private async getBusinessesTextForCity(city: string): Promise<string> {
    try {
      const businesses = await this.businessRepository.find({
        where: { city },
        take: 20,
      });

      if (businesses.length === 0) {
        return 'No business information available for this city.';
      }

      const context = businesses
        .map((business) => `${business.name} is a business in ${city}.`)
        .join(' ');

      return context;
    } catch (error) {
      console.error('Error getting businesses for context:', error);
      return 'Error retrieving business information.';
    }
  }

  async askQuestionForCity(city: string, question: string): Promise<string> {
    try {
      const API_URL = 'https://api-inference.huggingface.co/models/facebook/bart-large-cnn';
      const token = process.env.HUGGINGFACE_API_KEY

      if (!token) {
        throw new Error('Hugging Face API token not found');
      }

      const context = await this.getBusinessesTextForCity(city);
      const prompt = `Context: Here are some businesses in ${city}: ${context}\n\nQuestion: ${question}\nAnswer:`;

      const response = await axios.post(
        API_URL,
        {
          inputs: prompt,
          parameters: {
            max_length: 200,
            min_length: 30,
            temperature: 0.7,
            top_p: 0.95,
            repetition_penalty: 1.5,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        },
      );

      const result = response.data;
      const responseText = Array.isArray(result) ? result[0].summary_text : result.summary_text;
      return responseText;
    } catch (error) {
      console.error('Error in askQuestionForCity:', error);
      throw new InternalServerErrorException('Failed to get AI response');
    }
  }
}