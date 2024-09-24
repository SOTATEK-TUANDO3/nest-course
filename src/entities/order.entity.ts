import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToMany,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Product } from './product.entity';
import { Exclude } from 'class-transformer';
import { Payment } from './payment.entity';
import { OrderProduct } from './order-product.entity';

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ManyToMany(() => Product, (product: Product) => product.orders)
  products: Product[];

  @OneToMany(() => OrderProduct, (OrderProduct) => OrderProduct.order)
  orderProducts: OrderProduct[];

  @OneToOne(() => Payment, (payment: Payment) => payment.order)
  payment: Payment;

  @Column()
  customerId: number;

  @Column()
  address: string;

  @Column()
  phone: string;

  @Column()
  status: number;

  @CreateDateColumn()
  createdAt: string;

  @UpdateDateColumn()
  updatedAt: string;

  @Exclude()
  @DeleteDateColumn()
  deletedAt: string;
}
