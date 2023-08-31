import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { PlinkoDirection } from '../../config/config.service';

export type PlinkoDocument = HydratedDocument<Plinko>;

@Schema({ timestamps: true })
export class Plinko {
  _id: Types.ObjectId;

  @Prop({ required: true, index: true })
  userId: Types.ObjectId;

  @Prop({ required: true })
  win: number;

  @Prop({ required: true })
  multiplier: number;

  @Prop({ required: true })
  bet: number;

  @Prop({ required: true, type: [String] })
  pattern: PlinkoDirection[];

  @Prop({ required: false, default: false })
  isCompleted: boolean;

  @Prop({ required: false })
  createdAt: string;
}

export const PlinkoSchema = SchemaFactory.createForClass(Plinko);
