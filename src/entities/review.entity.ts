import { Exclude } from 'class-transformer';
import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity('reviews')
export class Review {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  customerId: number;

  @Column()
  productIt: number;

  @Column()
  text: string;

  @CreateDateColumn()
  createdAt: string;

  @UpdateDateColumn()
  updatedAt: string;

  @Exclude()
  @DeleteDateColumn()
  deletedAt: string;
}
