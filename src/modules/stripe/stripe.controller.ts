import { Body, Controller, Get, Post } from '@nestjs/common';
import { Public } from 'src/app/decorators/public';
import { StripeService } from './stripe.service';
import { CreateCheckoutSessionDto } from './dto/create-checkout-session.dto';

@Public()
@Controller('stripe')
export class StripeController {
  constructor(private stripeService: StripeService) {}

  @Get('products')
  async getProducts() {
    return await this.stripeService.getProducts();
  }

  @Get('customers')
  async getCustomers() {
    return await this.stripeService.getProducts();
  }

  @Post('create-checkout-session')
  async createCheckoutSession(@Body() createCheckoutSessionDto: CreateCheckoutSessionDto) {
    return this.stripeService.createCheckoutSession(createCheckoutSessionDto);
  }

  @Post('webhook')
  async webHook(@Body() payload: any) {
    return this.stripeService.webHook(payload);
  }
}
