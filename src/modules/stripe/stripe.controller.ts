import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AllowAccess } from 'src/app/decorators/allow-acess';
import { Roles } from 'src/app/enums/common.enum';
import { UserGuard } from 'src/app/guards/user.guard';
import { CreateCheckoutSessionDto } from './dto/create-checkout-session.dto';
import { StripeService } from './stripe.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Stripe')
@ApiBearerAuth()
@UseGuards(UserGuard)
@Controller('stripe')
export class StripeController {
  constructor(private stripeService: StripeService) {}

  @AllowAccess(Roles.ADMIN)
  @Get('products')
  async getProducts() {
    return await this.stripeService.getProducts();
  }

  @AllowAccess(Roles.ADMIN)
  @Get('customers')
  async getCustomers() {
    return await this.stripeService.getProducts();
  }

  @AllowAccess(Roles.CUSTOMER)
  @Post('create-checkout-session')
  async createCheckoutSession(@Body() createCheckoutSessionDto: CreateCheckoutSessionDto) {
    return this.stripeService.createCheckoutSession(createCheckoutSessionDto);
  }

  @AllowAccess(Roles.CUSTOMER)
  @Post('webhook')
  async webHook(@Body() payload: any) {
    return this.stripeService.webHook(payload);
  }
}
