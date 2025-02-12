import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateWishProductDto {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  productId: number;
}
