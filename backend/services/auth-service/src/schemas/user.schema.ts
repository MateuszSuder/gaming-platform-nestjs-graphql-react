import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export enum ROLE {
  TEST,
  USER,
  ADMIN,
}

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  _id: Types.ObjectId;

  @Prop({ required: true, unique: true, index: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true, default: ROLE.TEST })
  role: ROLE;
}

export const UserSchema = SchemaFactory.createForClass(User);
