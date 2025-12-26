import { IsNotEmpty, IsNumber } from 'class-validator';

export class InvestDto {
  @IsNotEmpty()
  @IsNumber()
  amount: number;

  @IsNotEmpty()
  investment: string;
}
