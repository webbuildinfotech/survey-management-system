import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuestionsController } from './question.controller';
import { QuestionsService } from './question.service';
import { Question } from './question.entity';

import { AiModule } from '../ai/ai.module';
import { Survey } from 'surveys/survey.entity';
import { Vote } from 'votes/vote.entity';
import { BusinessEntity } from 'business/business.entity';
import { UserEntity } from 'user/users.entity';
import { QuestionBusiness } from './entities/question-business.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Question, Survey, Vote, BusinessEntity, UserEntity, QuestionBusiness]),
    AiModule,
  ],
  controllers: [QuestionsController],
  providers: [QuestionsService],
  exports: [QuestionsService],
})
export class QuestionsModule {}