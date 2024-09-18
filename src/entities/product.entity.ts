import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Category } from './category.entity';
import { Exclude } from 'class-transformer';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ManyToMany(() => Category, (category: Category) => category.products)
  @JoinTable({
    name: 'category_product',
    joinColumn: {
      name: 'category_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'product_id',
      referencedColumnName: 'id',
    },
  })
  categories: Category[];

  @Column()
  name: string;

  @Column()
  description: string;

  @Column({ type: 'json' })
  images: string[];

  @Column()
  price: number;

  @CreateDateColumn()
  createdAt: string;

  @UpdateDateColumn()
  updatedAt: string;

  @Exclude()
  @DeleteDateColumn()
  deletedAt: string;
}
