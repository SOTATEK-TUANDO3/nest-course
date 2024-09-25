import { Body, Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { PaginationDtoConstants } from 'src/app/constants/pagination-dto.constants';
import { AllowAccess } from 'src/app/decorators/allow-acess';
import { Roles } from 'src/app/enums/common.enum';
import { UserGuard } from 'src/app/guards/user.guard';
import { CreateWishProductDto } from './dto/create-wish-product.dto';
import { WishProductService } from './wish-product.service';

@ApiBearerAuth()
@UseGuards(UserGuard)
@AllowAccess(Roles.CUSTOMER)
@ApiTags('Wish Product')
@Controller('wish-product')
export class WishProductController {
  constructor(private readonly wishProductService: WishProductService) {}

  @ApiOperation({ summary: 'List wish product' })
  @Get()
  async listWishProduct(@Param() paginationDtoConstants: PaginationDtoConstants) {
    return this.wishProductService.listWishProduct(paginationDtoConstants);
  }

  @ApiOperation({ summary: 'Create a new wish product' })
  @Post()
  async createWishProduct(@Body() createWishProductDto: CreateWishProductDto) {
    return this.wishProductService.createWishProduct(createWishProductDto);
  }

  @ApiOperation({ summary: 'Remove a wish product' })
  @Delete(':id')
  async removeWishProduct(@Param('id') id: number) {
    return this.wishProductService.removeWishProduct(id);
  }
}
