import { Controller, Post, UseGuards } from '@nestjs/common';
import { BusinessService } from './business.service';

@Controller('business')
export class BusinessController {
  constructor(private readonly businessService: BusinessService) {}

  @Post('seed')
  async seedBusinesses() {
    return this.businessService.seedBusinesses();
  }
} 