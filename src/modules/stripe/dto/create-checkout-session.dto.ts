import { IsNotEmpty, IsString } from 'class-validator';
import { CreateOrderDto } from 'src/modules/orders/dto/create-order.dto';

export class CreateCheckoutSessionDto extends CreateOrderDto {
  @IsNotEmpty()
  @IsString()
  priceDefault: string;
}
