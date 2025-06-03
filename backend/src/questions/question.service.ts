// src/questions/question.service.ts
import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { QuestionDocument } from './question.schema';
import { BusinessProfileDocument } from 'business-profile/business.profile.schema';
import { AiService } from '../ai/ai-service';
import { CreateQuestionDto } from './create-question.dto';
import { QuestionResponseDto } from './question-response.dto';

@Injectable()
export class QuestionsService {
  constructor(
    @InjectModel('Question') private questionModel: Model<QuestionDocument>,
    @InjectModel('Business')
    private businessModel: Model<BusinessProfileDocument>,
    private aiService: AiService,
  ) {}

  async handleQuestion(dto: CreateQuestionDto): Promise<QuestionResponseDto> {
    // 1) Use the optimized AI search
    const searchResult = await this.aiService.handleSearch(dto.question);

    // 2) Get city from AI response - FIXED: Use the location field
    const city = searchResult.l; // 'l' is the location/city field from AI response

    // 3) Create question document
    const questionDoc = await this.questionModel.create({
      question: dto.question,
      city, // Now this will be a string
      answer: searchResult.s,
      businesses: searchResult.m.map((b: { _id: string }) => b._id),
    });

    // 4) Return response
    return {
      message: 'Question processed successfully',
      question: questionDoc.question,
      aiSummarizedQuestion: searchResult.q,
      city,
      aiResponse: searchResult.s,
      businessList: searchResult.r,
      matchedBusinesses: searchResult.m,
    };
  }
}