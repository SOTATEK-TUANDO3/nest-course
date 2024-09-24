import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsNumber } from 'class-validator';
import { OrderStatus } from 'src/app/enums/common.enum';

export class UpdateOrderStatusDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsEnum(OrderStatus)
  orderStatus: OrderStatus;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  orderId: number;
}
