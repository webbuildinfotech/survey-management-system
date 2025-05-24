import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Business, BusinessDocument } from './business.schema';

@Injectable()
export class BusinessService {
  private readonly logger = new Logger(BusinessService.name);

  constructor(
    @InjectModel(Business.name)
    private businessModel: Model<BusinessDocument>,
  ) {}

  async findByCity(city: string): Promise<BusinessDocument[]> {
    return this.businessModel.find({ g_city: city }).exec();
  }

  async findById(id: string): Promise<BusinessDocument> {
    const business = await this.businessModel.findById(id).exec();
    if (!business) {
      throw new NotFoundException(`Business with ID ${id} not found`);
    }
    return business;
  }

  async findAll(): Promise<BusinessDocument[]> {
    return this.businessModel.find().exec();
  }
} 