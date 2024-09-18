import { Module } from '@nestjs/common';
import { AdminProductService } from './admin-product.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from 'src/entities/product.entity';
import { Category } from 'src/entities/category.entity';
import { AdminProductController } from './admin-product.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Product, Category])],
  controllers: [AdminProductController],
  providers: [AdminProductService],
})
export class AdminProductModule {}
