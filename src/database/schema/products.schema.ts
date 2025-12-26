import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Product extends Document {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  creator: mongoose.Types.ObjectId;

  @Prop({ isRequired: true })
  name: string;

  @Prop({ isRequired: true })
  price: number;

  @Prop({ default: null })
  quantity: number;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
