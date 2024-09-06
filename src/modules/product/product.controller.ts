import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Public } from 'src/app/decorators/public';

@ApiTags('Product')
@Public()
@Controller('product')
export class ProductController {
  constructor() {}
}
