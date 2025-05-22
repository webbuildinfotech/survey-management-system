import { Injectable, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeepPartial } from 'typeorm';

import { AiService } from 'ai/ai-service';
import { QuestionResponseDto, BusinessVoteDto, VoterDto } from './question-response.dto';
import { CreateQuestionDto } from './create-question.dto';
import { UserEntity } from 'user/users.entity';
import { BusinessEntity } from 'business/business.entity';
import { Question } from './question.entity';
import { Survey } from 'surveys/survey.entity';
import { Vote } from 'votes/vote.entity';
import { QuestionBusiness } from './entities/question-business.entity';

@Injectable()
export class QuestionsService {
  constructor(
    @InjectRepository(Question)
    private questionRepository: Repository<Question>,
    @InjectRepository(Survey)
    private surveyRepository: Repository<Survey>,
    @InjectRepository(Vote)
    private voteRepository: Repository<Vote>,
    @InjectRepository(BusinessEntity)
    private businessRepository: Repository<BusinessEntity>,
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    @InjectRepository(QuestionBusiness)
    private questionBusinessRepository: Repository<QuestionBusiness>,
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

  async handleQuestion(createQuestionDto: CreateQuestionDto): Promise<QuestionResponseDto> {
    try {
      const { question } = createQuestionDto;

      // Extract city from question
      const city = this.extractCityFromQuestion(question);
      if (!city) {
        throw new BadRequestException(
          'Could not identify city in the question. Please include a city name (e.g., "in San Francisco")',
        );
      }

      // Check if city exists in database
      const cityExists = await this.businessRepository.findOne({
        where: { city },
        select: ['city'],
      });

      if (!cityExists) {
        throw new BadRequestException(`No businesses found for city: ${city}`);
      }

      // Check for duplicate question
      const existingQuestion = await this.questionRepository.findOne({
        where: { 
          question,
          city 
        }
      });

      if (existingQuestion) {
        throw new BadRequestException('This question has already been asked for this city');
      }

      // Get AI response
      const aiResponse = await this.aiService.askQuestionForCity(city, question);

      // Get all businesses in the city
      const businesses = await this.businessRepository.find({
        where: { city },
        select: ['id', 'name', 'full_address', 'google_maps_url'],
      });

      // Save the question and AI response
      const newQuestion = await this.questionRepository.save({
        question,
        city,
        answer: aiResponse,
      } as DeepPartial<Question>);

      // Save all business relationships
      await Promise.all(
        businesses.map(business =>
          this.questionBusinessRepository.save({
            questionId: newQuestion.id,
            businessId: business.id,
          } as DeepPartial<QuestionBusiness>)
        )
      );

      // Create a new survey
      const survey = await this.surveyRepository.save({
        title: question,
        city,
        questionId: newQuestion.id || 0,
      } as unknown as DeepPartial<Survey>);

      // Get random users
      const users = await this.userRepository
        .createQueryBuilder('user')
        .orderBy('RANDOM()')
        .limit(10)
        .getMany();

      // Assign random votes
      for (const user of users) {
        const randomBusiness = businesses[Math.floor(Math.random() * businesses.length)];
        await this.voteRepository.save({
          surveyId: survey.id,
          userId: user.id,
          businessId: randomBusiness.id,
        });
      }

      // Get survey results with vote counts
      const voteCounts = await this.voteRepository
        .createQueryBuilder('vote')
        .select('vote.businessId', 'businessId')
        .addSelect('COUNT(vote.id)', 'vote_count')
        .addSelect('business.name', 'businessName')
        .leftJoin('vote.business', 'business')
        .where('vote.surveyId = :surveyId', { surveyId: survey.id })
        .groupBy('vote.businessId')
        .addGroupBy('business.id')
        .addGroupBy('business.name')
        .orderBy('vote_count', 'DESC')
        .getRawMany();

      // Get detailed vote information
      const detailedVotes = await this.voteRepository.find({
        where: { surveyId: survey.id },
        relations: ['business', 'user'],
        order: { createdAt: 'DESC' },
      });

      // Format the response
      const formattedResults: BusinessVoteDto[] = voteCounts.map((vc) => {
        const businessVotes = detailedVotes.filter(
          (vote) => vote.businessId === vc.businessId,
        );

        return {
          businessName: vc.businessName,
          votes: parseInt(vc.vote_count),
          voters: businessVotes.map((vote) => ({
            name: vote.user.name ?? 'Unknown',
            email: vote.user.email,
            location: vote.user.location,
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
    } catch (error:any) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException(error.message);
    }
  }

  async getAll(): Promise<Partial<Question>[]> {
    const questions = await this.questionRepository.find({
      relations: ['questionBusinesses.business'],
      order: {
        createdAt: 'DESC'
      }
    });

    return questions.map(question => {
      const { questionBusinesses, ...questionWithoutBusinesses } = question;
      return {
        ...questionWithoutBusinesses,
        businesses: questionBusinesses?.map(qb => ({
          id: qb.business.id,
          name: qb.business.name,
          full_address: qb.business.full_address,
          google_maps_url: qb.business.google_maps_url
        }))
      };
    });
  }
}