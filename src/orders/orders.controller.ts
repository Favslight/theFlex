import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { OrdersService } from './orders.service';
import mongoose from 'mongoose';
import { CreateOrderDto } from './dto';
import { JwtGuard } from '../common/guard';
import { GetUser } from '../common/decorator';

@UseGuards(JwtGuard)
@Controller('orders')
export class OrdersController {
  constructor(private ordersService: OrdersService) {}

  @Post()
  createOrder(@Body() dto: CreateOrderDto) {
    return this.ordersService.createOrder(dto);
  }

  @Get()
  getOrders(@GetUser('id') userId: mongoose.Types.ObjectId) {
    return this.ordersService.getOrders(userId);
  }
}
