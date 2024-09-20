import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateCheckoutSessionDto {
  @IsNotEmpty()
  @IsString()
  priceDefault: string;

  @IsNotEmpty()
  @IsNumber()
  productId: number;
}
