import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, SchemaTypes, Types } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @Prop({
    required: true,
    index: true,
    unique: true,
    type: SchemaTypes.ObjectId,
  })
  userId: Types.ObjectId;

  @Prop({ required: true, default: 10000 })
  balance: number;
}

export const UserSchema = SchemaFactory.createForClass(User);
