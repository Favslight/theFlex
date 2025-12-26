import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../database/schema';
import mongoose, { Model } from 'mongoose';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async getNetwork(userId: mongoose.Types.ObjectId) {
    return this.userModel
      .find({ referredBy: userId })
      .sort({ createdAt: -1 })
      .limit(5)
      .select('-hash');
  }
}
