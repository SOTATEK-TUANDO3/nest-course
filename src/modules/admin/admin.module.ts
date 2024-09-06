import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { AdminProductModule } from './admin-product/admin-product.module';

@Module({
  imports: [AdminProductModule],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
