import { Controller, Post, Body, Get, Res, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { QuestionsService } from './question.service';
import { CreateQuestionDto } from './create-question.dto';
import { QuestionResponseDto } from './question-response.dto';

@Controller('questions')
export class QuestionsController {
  constructor(private readonly questionsService: QuestionsService) {}

  @Post()
  async handleQuestion(
    @Body() createQuestionDto: CreateQuestionDto,
  ): Promise<QuestionResponseDto> {
    return this.questionsService.handleQuestion(createQuestionDto);
  }

  @Get('list')
  async getAllQuestions(@Res() response: Response) {
    // const questions = await this.questionsService.getAll();
    // return response.status(HttpStatus.OK).json({
    //   length: questions.length,
    //   data: questions,
    // });
    return null;
  }
}