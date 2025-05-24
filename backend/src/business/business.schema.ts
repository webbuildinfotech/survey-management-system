import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Business extends Document {
  @Prop({ required: true })
  g_business_name!: string;

  @Prop()
  g_categories?: string;

  @Prop()
  g_phone?: string;

  @Prop()
  g_full_address?: string;

  @Prop()
  g_street_address?: string;

  @Prop()
  g_city?: string;

  @Prop()
  g_state?: string;

  @Prop()
  g_zipcode?: string;

  @Prop()
  g_country?: string;

  @Prop()
  g_latitude?: string;

  @Prop()
  g_longitude?: string;

  @Prop()
  g_star_rating?: string;

  @Prop()
  g_review_count?: string;

  @Prop()
  g_hours_of_operation?: string;

  @Prop()
  g_website?: string;

  @Prop()
  g_closed_status?: string;

  @Prop()
  google_maps_url?: string;
}

export type BusinessDocument = Business & Document;
export const BusinessSchema = SchemaFactory.createForClass(Business);
