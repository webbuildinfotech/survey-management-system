import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Vote extends Document {
  @Prop({ type: Types.ObjectId, ref: 'Survey', required: true })
  surveyId!: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId!: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Business', required: true })
  businessId?: Types.ObjectId;
}

export type VoteDocument = Vote & Document;
export const VoteSchema = SchemaFactory.createForClass(Vote);
