// src/questions/question.service.ts
import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { QuestionDocument } from './question.schema';
import { SurveyDocument } from '../surveys/survey.schema';
import { BusinessProfileDocument } from 'business-profile/business.profile.schema';
import { AiService } from '../ai/ai-service';
import { CreateQuestionDto } from './create-question.dto';
import { QuestionResponseDto } from './question-response.dto';

import { Vote } from '../votes/vote.schema';
import { User } from 'user/users.schema';

@Injectable()
export class QuestionsService {
  constructor(
    @InjectModel('Question') private questionModel: Model<QuestionDocument>,
    @InjectModel('Survey') private surveyModel: Model<SurveyDocument>,
    @InjectModel('Business')
    private businessModel: Model<BusinessProfileDocument>,
    @InjectModel('User') private userModel: Model<User>,
    @InjectModel('Vote') private voteModel: Model<Vote>,
    private aiService: AiService,
  ) {}

  async handleQuestion(dto: CreateQuestionDto): Promise<QuestionResponseDto> {
    // 1) Use the new AI search functionality first
    const searchResult = await this.aiService.handleSearch(dto.question);

    // 2) Get city from AI response
    const city = (searchResult as any).location;
    if (!city) {
      throw new BadRequestException(
        'Could not determine city from your question.',
      );
    }

    // 3) prevent duplicates
    if (await this.questionModel.exists({ question: dto.question, city })) {
      throw new BadRequestException(
        'This question has already been asked for that city.',
      );
    }

    // 4) Create question and survey documents
    const questionDoc = await this.questionModel.create({
      question: dto.question,
      city,
      answer: searchResult.summary,
      businesses: (searchResult.results as any[]).map((b) => b._id),
    });

    // 5) Assign random votes
    console.time('Vote Assignment');
    const users = await this.userModel.find({ isDeleted: false });

    // Create basic results with business info and random votes
    const surveyResults = await Promise.all(
      (searchResult.results as any[]).map(async (biz) => {
        // Get unique random users for this business
        const shuffledUsers = [...users].sort(() => Math.random() - 0.5);
        const randomVotes = Math.min(
          Math.floor(Math.random() * 10) + 1,
          shuffledUsers.length,
        );

        // Create actual vote records in database
        const votes = [];
        for (let i = 0; i < randomVotes; i++) {
          const vote = await this.voteModel.create({
            surveyId: questionDoc._id,
            userId: shuffledUsers[i]._id,
            businessId: biz._id,
          });
          votes.push(vote);
        }

        // Get voters with their details
        const voters = await Promise.all(
          votes.map(async (vote) => {
            const user = await this.userModel.findById(vote.userId);
            return {
              name: user?.name || 'Anonymous',
              email: user?.email || 'anonymous@example.com',
              location: user?.city || 'Unknown',
            };
          }),
        );

        return {
          businessName: biz.g_business_name,
          full_address: biz.g_full_address,
          google_maps_url: biz.google_maps_url,
          votes: randomVotes,
          voters: voters,
          voteIds: votes.map((v) => v._id),
        };
      }),
    );

    // Update survey with vote references
    const surveyDoc = await this.surveyModel.create({
      title: questionDoc.answer,
      city,
      questionId: questionDoc._id,
      votes: surveyResults.flatMap((result) => result.voteIds),
    });

    return {
      message: 'Survey created successfully with random votes',
      question: questionDoc.question,
      city,
      aiResponse: questionDoc.answer ?? '',
      surveyResults: surveyResults.map((result) => ({
        businessName: result.businessName,
        full_address: result.full_address,
        google_maps_url: result.google_maps_url,
        votes: result.votes,
        voters: result.voters,
      })),
    };
  }

  async assignRandomVotes(surveyId: string): Promise<QuestionResponseDto> {
    // Get the survey and its question
    const survey = await this.surveyModel
      .findById(surveyId)
      .populate('questionId');
    if (!survey) {
      throw new BadRequestException('Survey not found');
    }

    const question = await this.questionModel.findById(survey.questionId);
    if (!question) {
      throw new BadRequestException('Question not found');
    }

    // Get all active users
    const users = await this.userModel.find({ isDeleted: false });
    if (users.length === 0) {
      throw new BadRequestException('No users available for voting');
    }

    // Get all businesses for this question
    const businesses = await this.businessModel.find({
      _id: { $in: question.businesses },
    });

    // Randomly assign votes
    const votes = [];
    for (const user of users) {
      // Randomly select a business for this user to vote for
      const randomBusiness =
        businesses[Math.floor(Math.random() * businesses.length)];

      // Create a vote
      const vote = await this.voteModel.create({
        surveyId: survey._id,
        userId: user._id,
        businessId: randomBusiness._id,
      });

      votes.push(vote);
    }

    // Update survey with votes
    survey.votes = votes.map((v) => v._id as unknown as Types.ObjectId);
    await survey.save();

    // Get updated results with vote counts
    const businessVotes = await this.voteModel.aggregate([
      { $match: { surveyId: survey._id } },
      {
        $group: {
          _id: '$businessId',
          voteCount: { $sum: 1 },
          voters: { $push: '$userId' },
        },
      },
      { $sort: { voteCount: -1 } },
    ]);

    // Map results to the expected format
    const surveyResults = businesses.map((business) => {
      const voteInfo = businessVotes.find(
        (v) => v._id.toString() === (business._id as Types.ObjectId).toString(),
      ) || { voteCount: 0, voters: [] };
      return {
        businessName: business.g_business_name,
        full_address: business.g_full_address,
        google_maps_url: business.google_maps_url,
        votes: voteInfo.voteCount,
        voters: voteInfo.voters,
      };
    });

    return {
      message: 'Votes assigned successfully',
      question: question.question ?? '',
      city: question.city ?? '',
      aiResponse: question.answer ?? '',
      surveyResults,
    };
  }
}
