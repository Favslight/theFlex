import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import * as argon from 'argon2';
import { AuthType, Gender, UserRole } from '../../common';

@Schema({ timestamps: true })
export class User extends Document {
  @Prop({ isRequired: true, unique: true })
  email: string;

  @Prop({ isRequired: true })
  hash: string;

  @Prop({ isRequired: false })
  firstName: string;

  @Prop({ isRequired: true })
  lastName: string;

  @Prop({
    default:
      'https://amzn-bflexi.s3.eu-west-3.amazonaws.com/Bflexi+Primary+Colour+Logo.png',
  })
  image: string;

  @Prop({ isRequired: false })
  phoneNumber: string;

  @Prop({ type: String, enum: Gender, isRequired: false })
  gender: Gender;

  @Prop({ type: String, enum: UserRole, default: UserRole.CUSTOMER })
  role: UserRole;

  @Prop({ default: false })
  isVerified: boolean;

  @Prop({ type: String, enum: AuthType, default: AuthType.EMAIL })
  authType: AuthType;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null })
  referredBy: mongoose.Types.ObjectId | null;

  @Prop({ unique: true })
  code: string;

  kycAdded?: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.pre('save', async function (next) {
  if (!this.isModified('hash')) {
    return next();
  }

  try {
    console.log('hashing ...');
    this.hash = await argon.hash(this.hash);
  } catch (error) {
    return next(error);
  }
});
