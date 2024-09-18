import { Module } from '@nestjs/common';
import { AdminCategoryController } from './admin-category.controller';
import { AdminCategoryService } from './admin-category.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from 'src/entities/category.entity';
import { CommonHelper } from 'src/app/helper/common.helper';

@Module({
  imports: [TypeOrmModule.forFeature([Category])],
  controllers: [AdminCategoryController],
  providers: [AdminCategoryService, CommonHelper],
})
export class AdminCategoryModule {}
