import { Module } from '@nestjs/common';
import { AdminProductService } from './admin-product.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from 'src/entities/product.entity';
import { Category } from 'src/entities/category.entity';
import { AdminProductController } from './admin-product.controller';
import { Inventory } from 'src/entities/inventory.entity';
import { StripeModule } from 'src/modules/stripe/stripe.module';

@Module({
  imports: [TypeOrmModule.forFeature([Product, Category, Inventory]), StripeModule.forRootAsync()],
  controllers: [AdminProductController],
  providers: [AdminProductService],
})
export class AdminProductModule {}
