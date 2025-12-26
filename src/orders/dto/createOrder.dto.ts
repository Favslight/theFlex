import { OrderStatus } from '../../common';
import { IsNumber, IsString } from 'class-validator';

export class CreateOrderDto {
  @IsString()
  userId: string;

  @IsString()
  productId: string;

  @IsNumber()
  amount: number;
}
