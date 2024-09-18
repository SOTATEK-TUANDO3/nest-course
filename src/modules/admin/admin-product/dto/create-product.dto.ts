import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateProductDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  price: number;

  @ApiProperty()
  @IsNotEmpty()
  images: string[];

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  categoryId: number;
}
