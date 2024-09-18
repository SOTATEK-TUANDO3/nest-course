import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AllowAccess } from 'src/app/decorators/allow-acess';
import { Roles } from 'src/app/enums/common.enum';
import { UserGuard } from 'src/app/guards/user.guard';
import { AdminCategoryService } from './admin-category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { ListCategoryDto } from './dto/list-category.dto';

@ApiBearerAuth()
@UseGuards(UserGuard)
@AllowAccess(Roles.ADMIN)
@ApiTags('Admin Category')
@Controller('admin/category')
export class AdminCategoryController {
  constructor(private readonly adminCategoryService: AdminCategoryService) {}

  @ApiOperation({ summary: 'Create a new Category' })
  @Post()
  async createCategory(@Body() createCategoryDto: CreateCategoryDto) {
    return this.adminCategoryService.createCategory(createCategoryDto);
  }

  @ApiOperation({ summary: 'Delete a Category' })
  @Delete(':id')
  async deleteCategory(@Param('id', ParseIntPipe) id: number) {
    return this.deleteCategory(id);
  }

  @ApiOperation({ summary: 'Update a Category' })
  @Post(':id')
  async updateCategory(@Body() updateCategoryDto: UpdateCategoryDto) {
    return this.updateCategory(updateCategoryDto);
  }

  @ApiOperation({ summary: 'List category' })
  @Get()
  async listCategories(@Query() params: ListCategoryDto) {
    return this.listCategories(params);
  }
}
