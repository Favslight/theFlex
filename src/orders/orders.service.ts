import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Order } from '../database/schema';
import mongoose, { Model } from 'mongoose';
import { IAppResponse, OrderStatus } from '../common';
import { CreateOrderDto } from './dto';

@Injectable()
export class OrdersService {
  constructor(@InjectModel(Order.name) private orderModel: Model<Order>) {}

  async createOrder(dto: CreateOrderDto): Promise<IAppResponse> {
    const order = await this.orderModel.create({
      ...dto,
      status: OrderStatus.COMPLETED,
    });
    return {
      statusCode: HttpStatus.CREATED,
      message: `Order created successfully.`,
      data: order,
    };
  }

  async getOrders(userId: mongoose.Types.ObjectId): Promise<IAppResponse> {
    const orders = await this.orderModel
      .find({ user: userId })
      .populate('product');
    return {
      statusCode: HttpStatus.OK,
      message: `Orders for ${userId}`,
      data: orders,
    };
  }
}
