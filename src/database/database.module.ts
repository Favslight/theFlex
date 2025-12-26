import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Otp,
  OtpSchema,
  Product,
  ProductSchema,
  Order,
  OrderSchema,
  User,
  UserSchema,
  Investment,
  InvestmentSchema,
  UserInvestment,
  Transaction,
  UserInvestmentSchema,
  TransactionSchema,
} from './schema';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRootAsync({
      useFactory: (config: ConfigService) => ({
        uri: config.get<string>(`MONGODB_URI`),
      }),
      inject: [ConfigService],
    }),
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Otp.name, schema: OtpSchema },
      { name: Product.name, schema: ProductSchema },
      { name: Order.name, schema: OrderSchema },
      { name: Investment.name, schema: InvestmentSchema },
      { name: UserInvestment.name, schema: UserInvestmentSchema },
      { name: Transaction.name, schema: TransactionSchema },
    ]),
  ],
  exports: [MongooseModule],
})
export class DatabaseModule {}
