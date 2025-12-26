import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto';
import { JwtGuard } from '../common/guard';
import { GetUser } from '../common/decorator';
import mongoose from 'mongoose';

@UseGuards(JwtGuard)
@Controller('products')
export class ProductsController {
  constructor(private productsService: ProductsService) {}

  @Post()
  create(
    @GetUser('id') userId: mongoose.Types.ObjectId,
    @Body() dto: CreateProductDto,
  ) {
    return this.productsService.create(userId, dto);
  }
}
