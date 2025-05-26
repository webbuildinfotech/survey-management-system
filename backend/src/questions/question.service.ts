// src/questions/question.service.ts
import { Injectable, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { BusinessDocument } from '../business/business.schema';
import { QuestionDocument } from './question.schema';
import { SurveyDocument } from '../surveys/survey.schema';
import { VoteDocument } from '../votes/vote.schema';
import { UserDocument } from '../user/users.schema';
import { AiService } from '../ai/ai-service';
import { CreateQuestionDto } from './create-question.dto';
import { QuestionResponseDto, BusinessVoteDto, VoterDto } from './question-response.dto';

@Injectable()
export class QuestionsService {
  constructor(
    @InjectModel('Question') private questionModel: Model<QuestionDocument>,
    @InjectModel('Survey') private surveyModel: Model<SurveyDocument>,
    @InjectModel('Vote') private voteModel: Model<VoteDocument>,
    @InjectModel('Business') private businessModel: Model<BusinessDocument>,
    @InjectModel('User') private userModel: Model<UserDocument>,
    private aiService: AiService,
  ) { }

  async handleQuestion(dto: CreateQuestionDto): Promise<QuestionResponseDto> {
    // 1) extract city
    const city = this.extractCityFromQuestion(dto.question);
    if (!city) {
      throw new BadRequestException(
        'Include "in <City>" in your question (e.g. "best poke in Anchorage").'
      );
    }

    // 2) ensure city exists
    if (! await this.businessModel.exists({ g_city: city })) {
      throw new BadRequestException(`No businesses found for city: ${city}`);
    }

    // 3) prevent duplicates
    if (await this.questionModel.exists({ question: dto.question, city })) {
      throw new BadRequestException('This question has already been asked for that city.');
    }

    // 4) ask the AI
    const aiAnswer = await this.aiService.askQuestionForCity(city, dto.question);

    // 5) extract search keywords from AI answer (naïve split on whitespace/punctuation)
    const keywords = aiAnswer
      .toLowerCase()
      .match(/\w+/g)
      ?.slice(0, 5)           // take first 5 distinct words
      .join(' ')              // join into a text-search string
      ?? '';

    // 6) run a text‐search query with score + rating sort + limit
    const businesses = await this.businessModel.aggregate([
      {
        $match: {
          g_city: city,
          $text: { $search: keywords }
        }
      },
      {
        $addFields: {
          score: { $meta: 'textScore' }
        }
      },
      {
        $sort: { score: -1, g_star_rating: -1 }
      },
      {
        $limit: 20
      },
      {
        $project: {
          _id: 1,
          g_business_name: 1,
          g_full_address: 1,
          google_maps_url: 1
        }
      }
    ]).exec();

    if (businesses.length === 0) {
      throw new BadRequestException('No relevant businesses found for that query.');
    }

    // 7) save the Question & Survey
    const questionDoc = await this.questionModel.create({
      question: dto.question,
      city,
      answer: aiAnswer,
      businesses: businesses.map(b => b._id),
    });
    const surveyDoc = await this.surveyModel.create({
      title: dto.question,
      city,
      questionId: questionDoc._id,
    });

    // 8) randomly pick 10 users for votes
    const users = await this.userModel.aggregate([{ $sample: { size: 10 } }]);

    // 9) batch‐generate votes
    const votes = [];
    for (const biz of businesses) {
      // up to 5 random votes per business
      const count = Math.floor(Math.random() * 5) + 1;
      const sampledUsers = users.sort(() => .5 - Math.random()).slice(0, count);
      for (const usr of sampledUsers) {
        votes.push({
          surveyId: surveyDoc._id,
          userId: usr._id,
          businessId: biz._id
        });
      }
    }
    await this.voteModel.insertMany(votes);

    // 10) aggregate vote counts + lookup top voters
    const results = await this.voteModel.aggregate([
      { $match: { surveyId: surveyDoc._id } },
      { $group: { _id: '$businessId', votes: { $sum: 1 } } },
      { $sort: { votes: -1 } },
      {
        $lookup: {
          from: 'business',
          localField: '_id',
          foreignField: '_id',
          as: 'biz'
        }
      },
      { $unwind: '$biz' },
      {
        $lookup: {
          from: 'vote',
          let: { bizId: '$_id' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ['$surveyId', surveyDoc._id] },
                    { $eq: ['$businessId', '$$bizId'] }
                  ]
                }
              }
            },
            { $sort: { createdAt: -1 } },
            { $limit: 3 },
            {
              $lookup: {
                from: 'user',
                localField: 'userId',
                foreignField: '_id',
                as: 'user'
              }
            },
            { $unwind: '$user' },
            {
              $project: {
                name: '$user.name',
                email: '$user.email',
                location: '$user.location'
              }
            }
          ],
          as: 'topVoters'
        }
      },
      {
        $project: {
          businessName: '$biz.g_business_name',
          full_address: '$biz.g_full_address',
          google_maps_url: '$biz.google_maps_url',
          votes: 1,
          voters: '$topVoters'
        }
      }
    ]);

    return {
      message: 'Survey created successfully',
      question: questionDoc.question,
      city,
      aiResponse: aiAnswer,
      surveyResults: results as BusinessVoteDto[]
    };
  }

  /**
 * Extracts a city name from a question string using patterns like "in X", "at X", or "from X".
 */
  private extractCityFromQuestion(question: string): string | null {
    const cityPatterns = [
      /in\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/,
      /at\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/,
      /from\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/,
    ];
    for (const pattern of cityPatterns) {
      const match = question.match(pattern);
      if (match && match[1]) {
        return match[1].trim();
      }
    }
    return null;
  }

  // async getAll(): Promise<TransformedQuestion[]> {
  //   const questions = (await this.questionModel
  //     .find()
  //     .populate<{
  //       businesses: BusinessDocument[];
  //     }>('businesses', 'g_business_name g_full_address google_maps_url')
  //     .sort({ createdAt: -1 })) as PopulatedQuestion[];

  //   const questionsWithVotes = await Promise.all(
  //     questions.map(async (question) => {
  //       const survey = await this.surveyModel.findOne({ questionId: question._id });
  //       if (!survey) {
  //         const questionObj = question.toObject();
  //         return {
  //           _id: questionObj._id as Types.ObjectId,
  //           question: questionObj.question as string,
  //           city: questionObj.city as string,
  //           answer: questionObj.answer as string | undefined,
  //           createdAt: questionObj.createdAt as Date,
  //           updatedAt: questionObj.updatedAt as Date,
  //           businesses: (question.businesses || []).map((b: BusinessDocument) => ({
  //             id: b._id as Types.ObjectId,
  //             name: b.g_business_name as string,
  //             full_address: b.g_full_address,
  //             google_maps_url: b.google_maps_url,
  //             votes: 0,
  //           })),
  //         } as TransformedQuestion;
  //       }

  //       const voteCounts = await this.voteModel.aggregate<{
  //         _id: Types.ObjectId;
  //         votes: number;
  //       }>([
  //         { $match: { surveyId: survey._id } },
  //         {
  //           $group: {
  //             _id: '$businessId',
  //             votes: { $sum: 1 },
  //           },
  //         },
  //       ]);

  //       const questionObj = question.toObject();
  //       return {
  //         _id: questionObj._id as Types.ObjectId,
  //         question: questionObj.question as string,
  //         city: questionObj.city as string,
  //         answer: questionObj.answer as string | undefined,
  //         createdAt: questionObj.createdAt as Date,
  //         updatedAt: questionObj.updatedAt as Date,
  //         businesses: (question.businesses || []).map((b: BusinessDocument) => {
  //           const voteCount = voteCounts.find(
  //             (vc) => vc._id.toString() === (b._id as Types.ObjectId).toString(),
  //           )?.votes || 0;

  //           return {
  //             id: b._id as Types.ObjectId,
  //             name: b.g_business_name as string,
  //             full_address: b.g_full_address,
  //             google_maps_url: b.google_maps_url,
  //             votes: voteCount,
  //           };
  //         }),
  //       } as TransformedQuestion;
  //     }),
  //   );

  //   return questionsWithVotes;
  // }
}
