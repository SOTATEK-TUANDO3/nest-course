import { Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Public } from 'src/app/decorators/public';
import { ProductService } from './product.service';

@ApiTags('Product')
@Public()
@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}
}
