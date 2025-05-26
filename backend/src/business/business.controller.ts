// src/business/business.controller.ts
import {
  Controller,
  Get,
  Param,
  Query,
  NotFoundException,
} from '@nestjs/common';

import { BusinessService } from './business.service';
import { BusinessFilterDto } from './create-business.dto';
import { Business } from './business.schema';

@Controller('business')
export class BusinessController {
  constructor(private readonly businessService: BusinessService) {}

  /**  
   * GET /business?city=Anchorage&state=AK&minRating=4.0&after=…&limit=100  
   */
  @Get()
  async findAll(
    @Query() filter: BusinessFilterDto,
  ): Promise<{ data: Business[]; nextAfter: any | null }> {
    return this.businessService.findAll(filter);
  }

  /**  
   * GET /business/city/:city  
   * Convenience wrapper for filtering by city only  
   */
  @Get('city/:city')
  async findByCity(
    @Param('city') city: string,
    @Query('limit') limit?: number,
  ): Promise<{ data: Business[]; nextAfter: any | null }> {
    return this.businessService.findAll({ city, limit });
  }

  /**
   * GET /business/:id
   */
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Business> {
    const biz = await this.businessService.findById(id);
    if (!biz) {
      throw new NotFoundException(`Business with id ${id} not found`);
    }
    return biz;
  }
}
