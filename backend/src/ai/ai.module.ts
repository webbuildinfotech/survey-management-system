import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AiService } from './ai-service';
import { Business, BusinessSchema } from '../business/business.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Business.name, schema: BusinessSchema }])
  ],
  providers: [AiService],
  exports: [AiService],
})
export class AiModule {} 