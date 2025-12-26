import {
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import mongoose, { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import {
  Investment,
  Transaction,
  User,
  UserInvestment,
} from '../database/schema';
import { IAppResponse, TransactionMode, TransactionStatus } from '../common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom, retry } from 'rxjs';
import { createHmac } from 'node:crypto';

@Injectable()
export class PaystackService {
  private logger: Logger;
  constructor(
    @InjectModel(Investment.name) private investmentModel: Model<Investment>,
    @InjectModel(UserInvestment.name)
    private userInvestmentModel: Model<UserInvestment>,
    @InjectModel(Transaction.name) private transactionModel: Model<Transaction>,
    private http: HttpService,
    private config: ConfigService,
  ) {
    this.logger = new Logger(PaystackService.name);
  }

  async invest(
    user: User,
    amount: number,
    investmentId: mongoose.Types.ObjectId,
  ): Promise<IAppResponse> {
    const conversionRate = await this.getConversionRate();
    if (!conversionRate.success || !conversionRate.rate)
      throw new InternalServerErrorException('Conversion Failed');

    const newTransaction = await this.transactionModel.create({
      user: user.id,
      amount: amount * conversionRate.rate,
      investment: investmentId,
      mode: TransactionMode.PAYSTACK,
    });

    if (!newTransaction)
      throw new InternalServerErrorException('Conversion Failed');

    return {
      statusCode: HttpStatus.OK,
      message: 'Transaction successfully created',
      data: {
        key: this.config.get<string>('PAYSTACK_PUBLIC_KEY'),
        email: user.email,
        amount: newTransaction.amount * 100,
        ref: newTransaction.id,
      },
    };
  }

  async verifyWebhook(payload: any, paystackSignature: any) {
    const sk = this.config.get<string>('PAYSTACK_SECRET_KEY');
    if (!sk)
      throw new InternalServerErrorException(
        'PAYSTACK_SECRET_KEY is not defined in environment variables',
      );

    const hash = createHmac('sha512', sk)
      .update(JSON.stringify(payload))
      .digest('hex');

    if (hash !== paystackSignature)
      throw new UnauthorizedException('Invalid Signature');

    switch (payload.event) {
      case 'charge.success':
        {
          const transactionId: mongoose.Types.ObjectId = payload.data.reference;
          const updatedTransaction =
            await this.transactionModel.findByIdAndUpdate(
              transactionId,
              {
                status: TransactionStatus.SUCCESSFUL,
              },
              { new: true },
            );

          if (!updatedTransaction) return;

          await this.userInvestmentModel.create({
            user: updatedTransaction.user,
            investment: updatedTransaction.investment,
            amount: updatedTransaction.amount,
          });
        }
        break;
      default:
        this.logger.log(`Unhandled event received ${payload.event}`);
    }

    this.logger.log('Received Webhook payload');

    return 'Webhook received successfully';
  }

  private async getConversionRate(): Promise<{
    success: boolean;
    rate?: number;
  }> {
    const url = `https://apilayer.net/api/live?access_key=${this.config.get<string>('CURRENCY_LAYER_KEY')}&currencies=NGN&source=USD&format=1`;

    try {
      const { data } = await firstValueFrom(this.http.get(url).pipe(retry(2)));

      if (!data?.success) {
        return {
          success: false,
        };
      }
      return {
        success: true,
        rate: data.quotes?.USDNGN || 0,
      };
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.message ||
        'Error fetching conversion rate';

      this.logger.error(`Currency API Error: ${message}`);
      return {
        success: false,
      };
    }
  }
}
