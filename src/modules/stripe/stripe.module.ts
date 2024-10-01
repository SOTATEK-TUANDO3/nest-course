import { DynamicModule, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { StripeController } from './stripe.controller';
import { StripeService } from './stripe.service';
import { OrderModule } from '../orders/order.module';

@Module({})
export class StripeModule {
  static forRootAsync(): DynamicModule {
    return {
      module: StripeModule,
      controllers: [StripeController],
      imports: [ConfigModule.forRoot(), OrderModule],
      providers: [
        StripeService,
        {
          provide: 'STRIPE_API_KEY',
          useFactory: async (configService: ConfigService) => configService.get('STRIPE_API_KEY'),
          inject: [ConfigService],
        },
      ],
      exports: [StripeService],
    };
  }
}
