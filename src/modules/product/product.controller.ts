import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Public } from 'src/app/decorators/public';
import { ProductService } from './product.service';

@ApiTags('Product')
@Public()
@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @ApiOperation({ summary: 'list recommend products for user' })
  @Get('recommend')
  async listRecommendedProducts() {
    return this.productService.listRecommendProducts();
  }
}
