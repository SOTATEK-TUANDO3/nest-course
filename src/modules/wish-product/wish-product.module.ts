import { Module } from '@nestjs/common';
import { WishProductController } from './wish-product.controller';
import { WishProductService } from './wish-product.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from 'src/entities/product.entity';
import { User } from 'src/entities/user.entity';
import { WishProduct } from 'src/entities/wish-product.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Product, User, WishProduct])],
  controllers: [WishProductController],
  providers: [WishProductService],
})
export class WishProductModule {}
