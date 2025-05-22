import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AiService } from './ai-service';
import { BusinessEntity } from 'business/business.entity';

@Module({
  imports: [TypeOrmModule.forFeature([BusinessEntity])],
  providers: [AiService],
  exports: [AiService],
})
export class AiModule {} 