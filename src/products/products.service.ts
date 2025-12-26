import { Body, Injectable } from '@nestjs/common';
import mongoose, { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Product } from '../database/schema';
import { CreateProductDto } from './dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<Product>,
  ) {}

  async create(
    userId: mongoose.Types.ObjectId,
    dto: CreateProductDto,
  ): Promise<Product> {
    return this.productModel.create({ userId, ...dto });
  }
}
