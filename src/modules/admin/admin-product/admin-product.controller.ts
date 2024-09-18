import { Body, Controller, Delete, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AllowAccess } from 'src/app/decorators/allow-acess';
import { Roles } from 'src/app/enums/common.enum';
import { UserGuard } from 'src/app/guards/user.guard';
import { CreateProductDto } from './dto/create-product.dto';
import { AdminProductService } from './admin-product.service';
import { UpdateProductDto } from './dto/update-product.dto';

@ApiBearerAuth()
@UseGuards(UserGuard)
@AllowAccess(Roles.ADMIN)
@ApiTags('Admin Product')
@Controller('admin/product')
export class AdminProductController {
  constructor(private readonly adminProductService: AdminProductService) {}

  @ApiOperation({ summary: 'Create new Product' })
  @Post()
  async createProduct(@Body() createProductDto: CreateProductDto) {
    return this.adminProductService.createProduct(createProductDto);
  }

  @ApiOperation({ summary: 'Update Product' })
  @Patch(':id')
  async updateProduct(@Param('id', ParseIntPipe) id: number, @Body() updateProductDto: UpdateProductDto) {
    return this.adminProductService.updateProduct(id, updateProductDto);
  }

  @ApiOperation({ summary: 'Delete Product' })
  @Delete(':id')
  async deleteProduct(@Param('id', ParseIntPipe) id: number) {
    return this.adminProductService.deleteProduct(id);
  }
}
