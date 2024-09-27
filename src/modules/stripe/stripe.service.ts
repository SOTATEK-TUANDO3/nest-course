import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import Stripe from 'stripe';
import { OrderService } from '../orders/order.service';
import { CreateCheckoutSessionDto } from './dto/create-checkout-session.dto';

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
}
