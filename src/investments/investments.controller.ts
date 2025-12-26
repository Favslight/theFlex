import { Controller, Get, HttpStatus, UseGuards } from '@nestjs/common';
import { InvestmentsService } from './investments.service';
import { IAppResponse, UserRole } from '../common';
import { GetUser, Public, RolesDecorator } from '../common/decorator';
import { JwtGuard, RolesGuard } from '../common/guard';
import mongoose from 'mongoose';

@UseGuards(JwtGuard, RolesGuard)
@RolesDecorator(UserRole.INVESTOR)
@Controller('investments')
export class InvestmentsController {
  constructor(private investmentsService: InvestmentsService) {}

  @Get('history')
  async getUserInvestments(
    @GetUser('id') userId: mongoose.Types.ObjectId,
  ): Promise<IAppResponse> {
    return {
      statusCode: HttpStatus.OK,
      message: `Investment history`,
      data: await this.investmentsService.getUserInvestments(userId),
    };
  }

  @Public()
  @Get()
  async getAllInvestmentOptions(): Promise<IAppResponse> {
    return {
      statusCode: HttpStatus.OK,
      message: `Investments list of investment options`,
      data: await this.investmentsService.getInvestmentOptions(),
    };
  }
}
