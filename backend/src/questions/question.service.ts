import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Question, QuestionDocument } from './question.schema';
import { Survey, SurveyDocument } from '../surveys/survey.schema';
import { Vote, VoteDocument } from '../votes/vote.schema';
import { Business, BusinessDocument } from '../business/business.schema';
import { User, UserDocument } from '../user/users.schema';
import { AiService } from '../ai/ai-service';
import { CreateQuestionDto } from './create-question.dto';
import { QuestionResponseDto, BusinessVoteDto } from './question-response.dto';

interface VoteCount {
  _id: Types.ObjectId;
  votes: number;
}

interface PopulatedVote extends Omit<VoteDocument, 'userId' | 'businessId'> {
  userId: UserDocument;
  businessId: BusinessDocument;
}

interface BusinessData {
  id: Types.ObjectId;
  name: string;
  full_address?: string;
  google_maps_url?: string;
  votes: number;
}

interface TransformedQuestion {
  _id: Types.ObjectId;
  question: string;
  city: string;
  answer?: string;
  createdAt: Date;
  updatedAt: Date;
  businesses: BusinessData[];
}

interface PopulatedQuestion extends Omit<QuestionDocument, 'businesses'> {
  businesses: BusinessDocument[];
}

@Injectable()
export class QuestionsService {
  constructor(
    @InjectModel(Question.name) private questionModel: Model<QuestionDocument>,
    @InjectModel(Survey.name) private surveyModel: Model<SurveyDocument>,
    @InjectModel(Vote.name) private voteModel: Model<VoteDocument>,
    @InjectModel(Business.name) private businessModel: Model<BusinessDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private aiService: AiService,
  ) {}

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

  async handleQuestion(
    createQuestionDto: CreateQuestionDto,
  ): Promise<QuestionResponseDto> {
    try {
      const { question } = createQuestionDto;
      const city = this.extractCityFromQuestion(question);

      if (!city) {
        throw new BadRequestException(
          'Could not identify city in the question. Please include a city name (e.g., "in San Francisco")',
        );
      }

      const cityExists = await this.businessModel.findOne({ g_city: city });

      if (!cityExists) {
        throw new BadRequestException(`No businesses found for city: ${city}`);
      }

      const existingQuestion = await this.questionModel.findOne({
        question,
        city,
      });
      if (existingQuestion) {
        throw new BadRequestException(
          'This question has already been asked for this city',
        );
      }

      const aiResponse = await this.aiService.askQuestionForCity(
        city,
        question,
      );
      const businesses = await this.businessModel
        .find({ g_city: city })
        .select('_id g_business_name g_full_address google_maps_url')
        .lean()
        .exec();

      if (!businesses || businesses.length === 0) {
        throw new BadRequestException(`No businesses found for city: ${city}`);
      }

      console.log(
        'Found businesses:',
        businesses.map((b) => ({ id: b._id, name: b.g_business_name })),
      );

      const businessIds = businesses.map((b) => b._id);

      const newQuestion = await this.questionModel.create({
        question,
        city,
        answer: aiResponse,
        businesses: businessIds,
      });

      if (!newQuestion.businesses || newQuestion.businesses.length === 0) {
        throw new InternalServerErrorException(
          'Failed to store business IDs in question',
        );
      }

      const survey = await this.surveyModel.create({
        title: question,
        city,
        questionId: newQuestion._id,
      });

      const users = await this.userModel.aggregate([{ $sample: { size: 10 } }]);

      // Create random votes for each business, ensuring one vote per user per business
      const votes = [];
      const usedUserBusinessPairs = new Set<string>(); // Track user-business pairs

      for (const business of businesses) {
        const randomVotes = Math.floor(Math.random() * 5) + 1; // Random number between 1 and 5
        let votesCreated = 0;

        // Shuffle users to randomize who votes
        const shuffledUsers = [...users].sort(() => Math.random() - 0.5);

        for (const user of shuffledUsers) {
          const pairKey = `${user._id}-${business._id}`;

          // Only create vote if this user hasn't voted for this business
          if (
            !usedUserBusinessPairs.has(pairKey) &&
            votesCreated < randomVotes
          ) {
            votes.push({
              surveyId: survey._id,
              userId: user._id,
              businessId: business._id,
            });
            usedUserBusinessPairs.add(pairKey);
            votesCreated++;
          }
        }
      }

      await this.voteModel.insertMany(votes);

      const voteCounts = await this.voteModel.aggregate<{
        _id: Types.ObjectId;
        votes: number;
      }>([
        { $match: { surveyId: survey._id } },
        {
          $group: {
            _id: '$businessId',
            votes: { $sum: 1 },
          },
        },
        { $sort: { votes: -1 } },
      ]);

      const detailedVotes = (await this.voteModel
        .find({ surveyId: survey._id })
        .populate<{ userId: UserDocument; businessId: BusinessDocument }>([
          { path: 'userId', select: 'name email location' },
          { path: 'businessId', select: 'g_business_name' },
        ])
        .sort({ createdAt: -1 })) as PopulatedVote[];

      const formattedResults: BusinessVoteDto[] = businesses.map((business) => {
        const businessVotes = detailedVotes.filter((v) => {
          const businessId = v.businessId as BusinessDocument;
          return (
            businessId &&
            businessId._id &&
            businessId._id.toString() === business._id.toString()
          );
        });

        const voteCount =
          voteCounts.find((vc) => vc._id.toString() === business._id.toString())
            ?.votes || 0;

        return {
          businessName: business.g_business_name,
          votes: voteCount,
          voters: businessVotes.map((v) => ({
            name: v.userId?.name || 'Unknown',
            email: v.userId?.email || '',
            location: v.userId?.location || '',
          })),
        };
      });

      return {
        message: 'Survey created successfully',
        question: newQuestion.question,
        city: newQuestion.city,
        aiResponse,
        surveyResults: formattedResults,
      };
    } catch (error: any) {
      if (error instanceof BadRequestException) throw error;
      throw new InternalServerErrorException(error.message);
    }
  }

  async getAll(): Promise<TransformedQuestion[]> {
    const questions = (await this.questionModel
      .find()
      .populate<{
        businesses: BusinessDocument[];
      }>('businesses', 'g_business_name g_full_address google_maps_url')
      .sort({ createdAt: -1 })) as PopulatedQuestion[];

    const questionsWithVotes = await Promise.all(
      questions.map(async (question) => {
        const survey = await this.surveyModel.findOne({ questionId: question._id });
        if (!survey) {
          const questionObj = question.toObject();
          return {
            _id: questionObj._id as Types.ObjectId,
            question: questionObj.question as string,
            city: questionObj.city as string,
            answer: questionObj.answer as string | undefined,
            createdAt: questionObj.createdAt as Date,
            updatedAt: questionObj.updatedAt as Date,
            businesses: (question.businesses || []).map((b: BusinessDocument) => ({
              id: b._id as Types.ObjectId,
              name: b.g_business_name as string,
              full_address: b.g_full_address,
              google_maps_url: b.google_maps_url,
              votes: 0,
            })),
          } as TransformedQuestion;
        }

        const voteCounts = await this.voteModel.aggregate<{
          _id: Types.ObjectId;
          votes: number;
        }>([
          { $match: { surveyId: survey._id } },
          {
            $group: {
              _id: '$businessId',
              votes: { $sum: 1 },
            },
          },
        ]);

        const questionObj = question.toObject();
        return {
          _id: questionObj._id as Types.ObjectId,
          question: questionObj.question as string,
          city: questionObj.city as string,
          answer: questionObj.answer as string | undefined,
          createdAt: questionObj.createdAt as Date,
          updatedAt: questionObj.updatedAt as Date,
          businesses: (question.businesses || []).map((b: BusinessDocument) => {
            const voteCount = voteCounts.find(
              (vc) => vc._id.toString() === (b._id as Types.ObjectId).toString(),
            )?.votes || 0;

            return {
              id: b._id as Types.ObjectId,
              name: b.g_business_name as string,
              full_address: b.g_full_address,
              google_maps_url: b.google_maps_url,
              votes: voteCount,
            };
          }),
        } as TransformedQuestion;
      }),
    );

    return questionsWithVotes;
  }
}
