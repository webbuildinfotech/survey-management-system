import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { Role } from '../roles/roles.schema';

export enum UserStatus {
  Active = 'Active',
  Inactive = 'Inactive',
}

@Schema({ timestamps: true })
export class User extends Document {
  @Prop({ required: true })
  name!: string;

  @Prop()
  mobile?: string;

  @Prop({ required: true, unique: true })
  email!: string;

  @Prop({ required: true })
  password!: string;

  @Prop({ required: true })
  city!: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Role', required: true })
  role!: Role;

  @Prop({ default: false })
  isDeleted?: boolean;

  @Prop({ type: String, default: null })
  otp?: string | null;

  @Prop({ type: Date, default: null })
  otpExpires?: Date | null;

  @Prop()
  location?: string;
}

export type UserDocument = User & Document;
export const UserSchema = SchemaFactory.createForClass(User);