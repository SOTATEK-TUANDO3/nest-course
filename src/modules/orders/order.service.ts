import { BadRequestException, Inject, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { constants } from 'src/app/constants/common.constant';
import { OrderStatus, PaymentStatus } from 'src/app/enums/common.enum';
import { Inventory } from 'src/entities/inventory.entity';
import { OrderProduct } from 'src/entities/order-product.entity';
import { Order } from 'src/entities/order.entity';
import { Payment } from 'src/entities/payment.entity';
import { Product } from 'src/entities/product.entity';
import { User } from 'src/entities/user.entity';
import { DataSource, Repository } from 'typeorm';
import { BaseService } from '../base/base.service';
import { MailerService } from '../Mailer/mail.service';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';

@Injectable()
export class OrderService extends BaseService {
  constructor(
    @Inject(constants.INJECT_TOKEN.AUTH_USER_ID) private readonly currentUserId,
    @InjectRepository(Order) private readonly orderRepo: Repository<Order>,
    @InjectRepository(Product) private readonly productRepo: Repository<Product>,
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    @InjectRepository(Inventory) private readonly inventoryRepo: Repository<Inventory>,
    @InjectRepository(OrderProduct) private readonly orderProductRepo: Repository<OrderProduct>,
    @InjectRepository(Payment) private readonly paymentRepo: Repository<Payment>,
    private readonly mailerService: MailerService,
    private readonly dataSource: DataSource,
  ) {
    super();
  }

  async getHistoryOrders() {
    const orders = await this.orderRepo
      .createQueryBuilder('order')
      .leftJoinAndSelect('order.orderProducts', 'OP')
      .getMany();

    return this.responseOk(orders);
  }

  async createOrder(createOrderDto: any, totalAmount: number) {
    let { address, phone, products } = createOrderDto;

    // convert products to array
    products = JSON.parse(products);
    console.log('products', products);

    const user = await this.userRepo.findOneBy({ id: this.currentUserId });
    if (!user) {
      throw new BadRequestException('User was not found');
    }

    const order = this.orderRepo.create();
    order.status = OrderStatus.PROCESSING;
    order.customerId = user.id;
    order.address = address;
    order.phone = phone;

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      await this.orderRepo.save(order);
      const promises = products.map(async (item) => {
        const product = await this.productRepo.findOneBy({ id: item.productId });
        const inventory = await this.inventoryRepo
          .createQueryBuilder('inventory')
          .where('inventory.productId = :productId', { productId: product.id })
          .getOne();

        if (inventory.quantity >= item.quantity) {
          inventory.quantity -= item.quantity;
          await this.orderProductRepo.save({
            orderId: order.id,
            productId: product.id,
            quantity: item.quantity,
            price: product.price,
          });
          await queryRunner.manager.save(Inventory, inventory);
        } else {
          throw new BadRequestException('Insufficient stock for product:' + product.name);
        }
      });
      await Promise.all(promises);

      const payment = this.paymentRepo.create();
      payment.totalAmount = totalAmount;
      payment.status = PaymentStatus.PAID;
      payment.paymentMethod = 'online';
      payment.orderId = order.id;
      await this.paymentRepo.save(payment);

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.log(error);
      throw new InternalServerErrorException();
    } finally {
      await queryRunner.release();
    }

    const to = [user.email];
    const templatePath = 'public/email-templates/confirmation-order-email.ejs';
    const templateData = {};
    const subject = 'Email confirm your order';
    await this.mailerService.sendEmail(to, subject, templatePath, templateData);
  }

  async updateOrderStatus(updateOrderStatusDto: UpdateOrderStatusDto) {
    const { orderId, orderStatus } = updateOrderStatusDto;
    const order = await this.orderRepo.findOneBy({ id: orderId });

    if (!order) {
      throw new BadRequestException('Order is not found');
    }

    order.status = orderStatus;
    await this.orderRepo.save(order);
  }
}
