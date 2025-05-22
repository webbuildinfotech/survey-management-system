import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { BusinessService } from './business.service';
import { BusinessEntity } from './business.entity';
import { BusinessController } from './business.controller';

@Module({
  imports: [TypeOrmModule.forFeature([BusinessEntity])],
  providers: [BusinessService],
  controllers: [BusinessController],
  exports: [BusinessService],
})
export class BusinessModule {} 