import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { User } from '../user/users.schema';

@Schema()
export class Role extends Document {
  @Prop({ required: true, unique: true })
  name?: string;

  @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'User' }] })
  users?: User[];
}

export const RoleSchema = SchemaFactory.createForClass(Role);
