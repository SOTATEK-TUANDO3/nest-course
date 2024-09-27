import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ArrayNotEmpty, IsArray, IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { ProductDto } from 'src/modules/orders/dto/create-order.dto';

export class CreateCheckoutSessionDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  priceDefault: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  address: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  phone: string;

  @ApiProperty({ type: [ProductDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @ArrayNotEmpty()
  @Type(() => ProductDto)
  products: ProductDto[];
}
