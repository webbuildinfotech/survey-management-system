import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Question extends Document {
  @Prop({ required: true })
  question!: string;

  @Prop({ required: true })
  city!: string;

  @Prop()
  answer?: string;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Business' }], required: true })
  businesses!: Types.ObjectId[];

  @Prop({ type: Types.ObjectId, ref: 'Survey' })
  survey?: Types.ObjectId;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Vote' }] })
  votes?: Types.ObjectId[];
}

export type QuestionDocument = Question & Document;
export const QuestionSchema = SchemaFactory.createForClass(Question);
