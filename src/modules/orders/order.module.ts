import { Module } from '@nestjs/common';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from 'src/entities/order.entity';
import { Product } from 'src/entities/product.entity';
import { MailModule } from '../Mailer/mail.module';
import { User } from 'src/entities/user.entity';
import { Inventory } from 'src/entities/inventory.entity';
import { OrderProduct } from 'src/entities/order-product.entity';
import { Payment } from 'src/entities/payment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Order, Product, User, Inventory, OrderProduct, Payment]), MailModule],
  controllers: [OrderController],
  providers: [OrderService],
  exports: [OrderService],
})
export class OrderModule {}
