import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { ArrayNotEmpty, IsArray, IsNotEmpty, IsNumber, IsString, ValidateNested } from 'class-validator';

export class ProductDto {
  @IsNotEmpty()
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  productId: number;

  @IsNotEmpty()
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  quantity: number;
}

export class CreateOrderDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  address: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  phone: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  @Transform(({ value }) => parseInt(value))
  totalAmount: number;

  @ApiProperty({ type: [ProductDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @ArrayNotEmpty()
  @Type(() => ProductDto)
  products: ProductDto[];
}
