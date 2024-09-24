import { Body, Controller, Get, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AllowAccess } from 'src/app/decorators/allow-acess';
import { Roles } from 'src/app/enums/common.enum';
import { UserGuard } from 'src/app/guards/user.guard';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';

@ApiBearerAuth()
@UseGuards(UserGuard)
@AllowAccess(Roles.CUSTOMER)
@ApiTags('Order Product')
@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @ApiOperation({ summary: 'Get history orders of customer' })
  @Get()
  async getHistoryOrders() {
    return this.orderService.getHistoryOrders();
  }

  @ApiOperation({ summary: 'Create a new Order' })
  @Post()
  async createOrder(@Body() createOrderDto: CreateOrderDto) {
    return this.orderService.createOrder(createOrderDto);
  }

  @ApiOperation({ summary: 'Update Order status' })
  @Patch()
  async UpdateOrderStatus(updateOrderStatusDto: UpdateOrderStatusDto) {
    return this.orderService.updateOrderStatus(updateOrderStatusDto);
  }
}
