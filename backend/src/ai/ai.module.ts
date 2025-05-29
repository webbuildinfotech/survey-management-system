import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AiService } from './ai-service';
import { Business, BusinessSchema } from '../business/business.schema';
import { SearchCache, SearchCacheSchema } from '../questions/search-cache.schema';
import { BusinessProfile, BusinessProfileSchema } from 'business-profile/business.profile.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Business.name, schema: BusinessSchema },
      { name: BusinessProfile.name, schema: BusinessProfileSchema },
      { name: SearchCache.name, schema: SearchCacheSchema }
    ])
  ],
  providers: [AiService],
  exports: [AiService],
})
export class AiModule {} 