import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateProductDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  price?: number;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  images?: string[];

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  categoryId?: number;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  quantity?: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  currency: string;
}
