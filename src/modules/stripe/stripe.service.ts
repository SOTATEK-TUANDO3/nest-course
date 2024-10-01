import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import Stripe from 'stripe';
import { OrderService } from '../orders/order.service';
import { CreateCheckoutSessionDto } from './dto/create-checkout-session.dto';
import { CreateProductStripeDto } from './dto/create-product.dto';
import { UpdateProductDto } from '../admin/admin-product/dto/update-product.dto';

@Injectable()
export class StripeService {
  private stripe: Stripe;

  constructor(
    @Inject('STRIPE_API_KEY') private readonly apiKey: string,
    private readonly orderService: OrderService,
  ) {
    this.stripe = new Stripe(this.apiKey);
  }

  async getProducts(): Promise<Stripe.Product[]> {
    const products = await this.stripe.products.list();
    return products.data;
  }

  async getCustomers() {
    const customers = await this.stripe.customers.list({});
    return customers.data;
  }

  async createCheckoutSession(createCheckoutSessionDto: CreateCheckoutSessionDto) {
    const { priceDefault, address, phone, products } = createCheckoutSessionDto;
    const session = await this.stripe.checkout.sessions.create({
      line_items: [
        {
          price: priceDefault,
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `https://translate.google.com/`,
      cancel_url: `https://translate.google.com/`,
      metadata: {
        address,
        phone,
        products: JSON.stringify(products),
      },
    });
    return session.url;
  }

  async fulfillCheckout(sessionId, metadata: any, totalAmount: number) {
    if (!metadata) {
      throw new BadRequestException('Metadata was not found');
    }

    // Retrieve the Checkout Session from the API with line_items expanded
    const checkoutSession = await this.stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['line_items'],
    });

    // Check the Checkout Session's payment_status property
    // to determine if fulfillment should be peformed
    if (checkoutSession.payment_status !== 'unpaid') {
      await this.orderService.createOrder(metadata, totalAmount);
    }
  }

  async webHook(event: any) {
    if (event.type === 'checkout.session.completed' || event.type === 'checkout.session.async_payment_succeeded') {
      await this.fulfillCheckout(event.data.object.id, event.data.object.metadata, event.data.object.amount_total);
    }

    return;
  }

  async findProduct(id: string) {
    return await this.stripe.products.retrieve(id);
  }

  async createProduct(createProductDto: CreateProductStripeDto) {
    return await this.stripe.products.create(createProductDto);
  }

  async createPrice(priceDto: { product: string; currency: string; unit_amount: number }) {
    const price = await this.stripe.prices.create(priceDto);
    await this.stripe.products.update(priceDto.product, {
      default_price: price.id,
    });
    return price;
  }

  async deleteProduct(id: string) {
    return await this.stripe.products.update(id, {
      active: false,
    });
  }

  async updateProduct(id: string, payload: UpdateProductDto) {
    const { name, description, images, price, currency } = payload;

    await this.updatePrice(id, price, currency);
    await this.stripe.products.update(id, {
      ...(name && { name }),
      ...(description && { description }),
      ...(images.length && { images }),
    });
  }

  async updatePrice(id: string, price: number, currency: string = 'usd') {
    const prices = await this.stripe.prices.list({
      product: id,
      active: true,
    });

    if (!prices.data.length) {
      throw new BadRequestException('No active prices found for this product.');
    }

    // create new price for product
    await this.stripe.prices.create({
      unit_amount: price,
      currency: currency,
      product: id,
    });

    // archive the old price
    await this.stripe.prices.update(prices.data[0].id, {
      active: false,
    });
  }
}
