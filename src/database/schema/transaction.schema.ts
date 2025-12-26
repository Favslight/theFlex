import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import {
  InvestmentType,
  TransactionMode,
  TransactionStatus,
} from '../../common';

@Schema({ timestamps: true })
export class Transaction extends Document {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  user: mongoose.Types.ObjectId;

  @Prop({
    type: String,
    enum: TransactionMode,
    default: TransactionMode.NOT_SELECTED,
  })
  mode: TransactionMode;

  @Prop()
  amount: number;

  @Prop({
    type: String,
    enum: TransactionStatus,
    default: TransactionStatus.PENDING,
  })
  status: TransactionStatus;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Investment',
    unique: true,
  })
  investment?: mongoose.Types.ObjectId;
}

export const TransactionSchema = SchemaFactory.createForClass(Transaction);
