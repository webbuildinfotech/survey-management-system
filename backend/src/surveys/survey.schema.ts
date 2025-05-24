import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export enum SurveyStatus {
  ACTIVE = 'active',
  COMPLETED = 'completed',
}

@Schema({ timestamps: true })
export class Survey extends Document {
  @Prop({ required: true })
  title!: string;

  @Prop({ required: true })
  city!: string;

  @Prop({ type: String, enum: SurveyStatus, default: SurveyStatus.ACTIVE })
  status?: SurveyStatus;

  @Prop({ type: Types.ObjectId, ref: 'Question', required: true })
  questionId!: Types.ObjectId;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Vote' }] })
  votes?: Types.ObjectId[];
}

export type SurveyDocument = Survey & Document;
export const SurveySchema = SchemaFactory.createForClass(Survey);
