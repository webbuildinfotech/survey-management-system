import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BusinessProfileController } from './business.profile.controller';
import { BusinessProfileService } from './business.profile.service';
import { Business, BusinessSchema } from '../business/business.schema';
import { GoogleGenAI } from '@google/genai';
import { BusinessProfile, BusinessProfileSchema } from './business.profile.schema';

const GOOGLE_AI_API_KEY = 'AIzaSyBkunWP4l4SVzCSbaP_oVNHrXO9OI_R33k' 
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Business.name, schema: BusinessSchema },
      { name: BusinessProfile.name, schema: BusinessProfileSchema }
    
    ]),
  ],
  controllers: [BusinessProfileController],
  providers: [
    BusinessProfileService,
    {
      provide: GoogleGenAI,
      useValue: new GoogleGenAI({
        apiKey: GOOGLE_AI_API_KEY
      })
    }
  ],
  exports: [BusinessProfileService],
})
export class BusinessProfileModule {}
