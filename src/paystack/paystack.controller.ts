import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Headers,
  UseGuards,
} from '@nestjs/common';
import { PaystackService } from './paystack.service';
import { JwtGuard, RolesGuard } from '../common/guard';
import { GetUser, Public, RolesDecorator } from '../common/decorator';
import { UserRole } from '../common';
import { User } from '../database/schema';
import mongoose from 'mongoose';
import { InvestDto } from './dto';

@Controller('paystack')
export class PaystackController {
  constructor(private paystackService: PaystackService) {}

  @UseGuards(JwtGuard, RolesGuard)
  @RolesDecorator(UserRole.INVESTOR)
  @Post('invest')
  invest(@GetUser() user: User, @Body() dto: InvestDto) {
    return this.paystackService.invest(
      user,
      dto.amount,
      dto.investment as unknown as mongoose.Types.ObjectId,
    );
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('webhook')
  verifyWebhook(
    @Body() payload: any,
    @Headers('x-paystack-signature') paystackSignature: any,
  ) {
    return this.paystackService.verifyWebhook(payload, paystackSignature);
  }
}
