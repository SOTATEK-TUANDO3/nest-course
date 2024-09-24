import { Exclude } from 'class-transformer';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinTable,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Order } from './order.entity';

@Entity('payment')
export class Payment {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  orderId: number;

  @OneToOne(() => Order, (order: Order) => order.payment)
  @JoinTable({ name: 'orderId' })
  order: Order;

  @Column()
  totalAmount: number;

  @Column()
  status: number;

  @Column()
  paymentMethod: string;

  @CreateDateColumn()
  createdAt: string;

  @UpdateDateColumn()
  updatedAt: string;

  @Exclude()
  @DeleteDateColumn()
  deletedAt: string;
}
