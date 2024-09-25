import { PartialType } from '@nestjs/swagger';
import { CreateWishProductDto } from './create-wish-product.dto';

export class RemoveWishProductDto extends PartialType(CreateWishProductDto) {}
