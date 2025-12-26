import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { OrderStatus } from '../../common';

@Schema({ timestamps: true })
export class Order extends Document {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', unique: false })
  user: mongoose.Types.ObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Product', unique: false })
  product: mongoose.Types.ObjectId;

  @Prop({ default: OrderStatus.IN_PROGRESS })
  status: OrderStatus;

  @Prop()
  amount: number;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
