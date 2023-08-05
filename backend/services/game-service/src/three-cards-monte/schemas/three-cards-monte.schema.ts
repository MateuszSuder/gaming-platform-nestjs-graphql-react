import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type ThreeCardsMonteDocument = HydratedDocument<ThreeCardsMonte>;

@Schema({ timestamps: true })
export class ThreeCardsMonte {
  _id: Types.ObjectId;

  @Prop({ required: true, index: true })
  userId: Types.ObjectId;

  @Prop({ required: true })
  bet: number;

  @Prop({ required: true })
  win: number;

  @Prop({ required: true })
  multiplier: number;
}

export const ThreeCardsMonteSchema =
  SchemaFactory.createForClass(ThreeCardsMonte);
