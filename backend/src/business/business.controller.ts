import { Controller, Get, Param, Res, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { BusinessService } from './business.service';

@Controller('business')
export class BusinessController {
  constructor(private readonly businessService: BusinessService) {}

  @Get('city/:city')
  async getBusinessesByCity(
    @Param('city') city: string,
    @Res() response: Response,
  ) {
    const businesses = await this.businessService.findByCity(city);
    return response.status(HttpStatus.OK).json({
      length: businesses.length,
      data: businesses,
    });
  }

  @Get(':id')
  async getBusinessById(
    @Param('id') id: string,
    @Res() response: Response,
  ) {
    const business = await this.businessService.findById(id);
    return response.status(HttpStatus.OK).json({
      data: business,
    });
  }

  @Get()
  async getAllBusinesses(@Res() response: Response) {
    const businesses = await this.businessService.findAll();
    return response.status(HttpStatus.OK).json({
      length: businesses.length,
      data: businesses,
    });
  }
} 