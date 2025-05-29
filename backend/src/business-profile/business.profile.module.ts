import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BusinessProfileController } from './business.profile.controller';
import { BusinessProfileService } from './business.profile.service';
import { BusinessProfile, BusinessProfileSchema } from './business.profile.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: BusinessProfile.name, schema: BusinessProfileSchema },
    ]),
  ],
  controllers: [BusinessProfileController],
  providers: [BusinessProfileService],
  exports: [BusinessProfileService],
})
export class BusinessProfileModule {}
