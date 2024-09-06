import { Module } from '@nestjs/common';
import { AdminProductService } from './admin-product.service';
import { AdminController } from '../admin.controller';

@Module({
  controllers: [AdminController],
  providers: [AdminProductService],
})
export class AdminProductModule {}
