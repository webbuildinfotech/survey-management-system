
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Business, BusinessDocument } from './business.schema';
import { BusinessFilterDto } from './create-business.dto';

@Injectable()
export class BusinessService {
  constructor(
    @InjectModel(Business.name)
    private readonly businessModel: Model<BusinessDocument>,
  ) {}

  /**
   * Cursor-based, filtered, projected, paginated fetch
   */
  async findAll(filter: BusinessFilterDto) {
    const {
      after,
      limit = 50,
      city,
      state,
      minRating,
    } = filter;

    const query: any = {};
    if (after) {
      // Cast after to ObjectId for comparison
      query._id = { $gt: new Types.ObjectId(after) };
    }
    if (city) {
      query.g_city = city;
    }
    if (state) {
      query.g_state = state;
    }
    if (minRating != null) {
      query.g_star_rating = { $gte: minRating };
    }

    // tell TS this returns BusinessDocument[]
  const docs = (await this.businessModel
    .find(query)
    .sort({ _id: 1 })
    .limit(limit)
    .select({
      g_business_name: 1,
      g_full_address: 1,
      g_phone: 1,
      g_star_rating: 1,
      g_review_count: 1,
      google_maps_url: 1,
    })
    .exec()) as BusinessDocument[];

  const nextAfter = docs.length > 0
    ? docs[docs.length - 1]._id
    : null;

  return { data: docs, nextAfter };
  }

  /**
   * Single document by ID
   */
  async findById(id: string): Promise<Business> {
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException(`Invalid business ID: ${id}`);
    }
    const biz = await this.businessModel
      .findById(id)
      .select({
        g_business_name: 1,
        g_full_address: 1,
        g_phone: 1,
        g_star_rating: 1,
        g_review_count: 1,
        google_maps_url: 1,
      })
      .exec();
    if (!biz) {
      throw new NotFoundException(`Business with id ${id} not found`);
    }
    return biz;
  }
}
