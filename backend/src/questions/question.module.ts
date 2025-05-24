import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { QuestionsController } from './question.controller';
import { QuestionsService } from './question.service';
import { Question, QuestionSchema } from './question.schema';
import { Survey, SurveySchema } from '../surveys/survey.schema';
import { Vote, VoteSchema } from '../votes/vote.schema';
import { Business, BusinessSchema } from '../business/business.schema';
import { User, UserSchema } from '../user/users.schema';
import { AiModule } from '../ai/ai.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Question.name, schema: QuestionSchema },
      { name: Survey.name, schema: SurveySchema },
      { name: Vote.name, schema: VoteSchema },
      { name: Business.name, schema: BusinessSchema },
      { name: User.name, schema: UserSchema }
    ]),
    AiModule
  ],
  controllers: [QuestionsController],
  providers: [QuestionsService],
  exports: [QuestionsService]
})
export class QuestionsModule {}