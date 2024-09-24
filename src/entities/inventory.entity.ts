import { Column, Entity, JoinTable, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Product } from './product.entity';

@Entity('inventory')
export class Inventory {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @OneToOne(() => Product)
  @JoinTable({ name: 'productId' })
  product: Product;

  @Column()
  quantity: number;
}
