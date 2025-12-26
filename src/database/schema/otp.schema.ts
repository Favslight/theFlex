import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Otp extends Document {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', unique: true })
  userId: mongoose.Types.ObjectId;

  @Prop({ isRequired: true })
  otp: string;
}

export const OtpSchema = SchemaFactory.createForClass(Otp);
