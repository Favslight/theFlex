import { Injectable } from '@nestjs/common';
import { Investment, UserInvestment } from '../database/schema';
import mongoose, { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { getUserInvestmentsAggregation } from './aggregations';

@Injectable()
export class InvestmentsService {
  constructor(
    @InjectModel(Investment.name) private investmentModel: Model<Investment>,
    @InjectModel(UserInvestment.name)
    private userInvestmentModel: Model<UserInvestment>,
  ) {}

  async getUserInvestments(userId: mongoose.Types.ObjectId) {
    const objectUserId = new mongoose.Types.ObjectId(userId);
    const getUserInvestmentsPipeline =
      getUserInvestmentsAggregation(objectUserId);
    return this.userInvestmentModel.aggregate(getUserInvestmentsPipeline);
  }

  // async getInvestmentData(userId: mongoose.Types.ObjectId) {
  //   await this.userInvestmentModel.aggregate([
  //       { $match: { userId: userId } },
  //       { $group: {_id: null, total: {$sum: "amount"}}}
  //   ])
  // }

  async getInvestmentOptions() {
    return this.investmentModel.find().sort({ createdAt: -1 });
  }
}
