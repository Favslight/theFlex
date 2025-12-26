import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { InvestmentType } from '../../common';

@Schema({ timestamps: true })
export class UserInvestment extends Document {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  user: mongoose.Types.ObjectId;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Investment',
    unique: true,
  })
  investment: mongoose.Types.ObjectId;

  @Prop({ default: false })
  hasMatured: boolean;

  @Prop()
  amount: number;
}

export const UserInvestmentSchema =
  SchemaFactory.createForClass(UserInvestment);
