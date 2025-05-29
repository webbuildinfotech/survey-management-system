import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class SearchCache extends Document {
  @Prop({ required: true })
  originalText!: string;

  @Prop({ required: true, unique: true })
  queryHash?: string;

  @Prop({ required: true })
  summary?: string;

  @Prop({ type: [String], required: true })
  categories?: string[];

  @Prop({ required: true })
  location?: string;

  @Prop({ type: [Object], required: true })
  results?: any[];
}

export const SearchCacheSchema = SchemaFactory.createForClass(SearchCache);