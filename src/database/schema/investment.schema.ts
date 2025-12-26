import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { InvestmentType } from '../../common';

@Schema({ timestamps: true })
export class Investment extends Document {
  @Prop({ isRequired: true })
  type: InvestmentType;

  @Prop({ isRequired: true })
  returnRate: number;

  @Prop({ isRequired: true })
  duration: number;

  @Prop({ isRequired: true })
  min: number;

  @Prop({ isRequired: true })
  max: number;

  @Prop()
  example: string;
}

export const InvestmentSchema = SchemaFactory.createForClass(Investment);
