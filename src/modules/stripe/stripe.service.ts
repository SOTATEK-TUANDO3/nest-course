import { Inject, Injectable } from '@nestjs/common';
import Stripe from 'stripe';
import { CreateCheckoutSessionDto } from './dto/create-checkout-session.dto';

@Injectable()
export class StripeService {
  private stripe: Stripe;

  constructor(@Inject('STRIPE_API_KEY') private readonly apiKey: string) {
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
    const { priceDefault, productId } = createCheckoutSessionDto;
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
        product_id: productId,
      },
    });
    return session.url;
  }

  async fulfillCheckout(sessionId, productId: number) {
    // Set your secret key. Remember to switch to your live secret key in production.
    // See your keys here: https://dashboard.stripe.com/apikeys

    // console.log('Fulfilling Checkout Session ' + sessionId);

    // TODO: Make this function safe to run multiple times,
    // even concurrently, with the same session ID

    // TODO: Make sure fulfillment hasn't already been
    // peformed for this Checkout Session

    // Retrieve the Checkout Session from the API with line_items expanded
    const checkoutSession = await this.stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['line_items'],
    });

    console.log('checkout session', checkoutSession, checkoutSession.payment_status);

    // Check the Checkout Session's payment_status property
    // to determine if fulfillment should be peformed
    if (checkoutSession.payment_status !== 'unpaid') {
      // TODO: Perform fulfillment of the line items
      // TODO: Record/save fulfillment status for this
      // Checkout Session
    }
  }

  async webHook(event: any) {
    if (event.type === 'checkout.session.completed' || event.type === 'checkout.session.async_payment_succeeded') {
      console.log('product_id', event.data.object.metadata.product_id);
      await this.fulfillCheckout(event.data.object.id, event.data.object.metadata.product_id);
    }

    return;
  }
}
