import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type SevenFruitsDocument = HydratedDocument<SevenFruits>;

@Schema()
class GameResult {
  @Prop({ required: true })
  win: number;

  @Prop({ required: true })
  multiplier: number;

  @Prop({ required: true })
  winningLines: number[][][];

  @Prop({ required: true })
  symbols: string[][];

  @Prop({ required: true })
  bet: number;
}

@Schema({ timestamps: true })
export class SevenFruits {
  _id: Types.ObjectId;

  @Prop({ required: true, index: true })
  userId: Types.ObjectId;

  @Prop({ required: true, type: GameResult })
  gameResult: GameResult;

  @Prop({ required: false, default: false })
  isCompleted: boolean;
}

export const SevenFruitsSchema = SchemaFactory.createForClass(SevenFruits);
