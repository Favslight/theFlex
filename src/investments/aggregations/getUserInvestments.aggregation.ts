import mongoose, { PipelineStage } from 'mongoose';

export const getUserInvestmentsAggregation = (
  objectUserId: mongoose.Types.ObjectId,
): PipelineStage[] => {
  return [
    //filter
    { $match: { user: objectUserId } },

    {
      $lookup: {
        from: 'investments',
        localField: 'investment',
        foreignField: '_id',
        as: 'investmentData',
      },
    },

    { $unwind: '$investmentData' },

    {
      $addFields: {
        maturityDate: {
          $dateAdd: {
            startDate: '$createdAt',
            unit: 'month',
            amount: '$investmentData.duration', // duration in months
          },
        },
        expectedReturn: {
          $multiply: [
            '$amount',
            { $divide: ['$investmentData.returnRate', 100] },
          ],
        },
      },
    },

    {
      $addFields: {
        status: {
          $cond: [{ $lte: ['$maturityDate', '$$NOW'] }, 'matured', 'active'],
        },
        hasMatured: { $lte: ['$maturityDate', '$$NOW'] }, // boolean as well
      },
    },

    {
      $project: {
        user: 1,
        investment: 1,
        amount: 1,
        hasMatured: 1,
        status: 1,
        maturityDate: 1,
        expectedReturn: 1,
        createdAt: 1,
        'investmentData.type': 1,
        'investmentData.returnRate': 1,
        'investmentData.duration': 1,
      },
    },
  ];
};
