import { Exclude } from 'class-transformer';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Role } from './role.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({
    unique: true,
  })
  userName: string;

  @Column({
    unique: true,
  })
  email: string;

  @Column()
  @Exclude()
  password: string;

  @Column()
  isVerified: boolean;

  @ManyToMany(() => Role, (role: Role) => role.roleUsers)
  roles: Role[];

  @CreateDateColumn()
  createdAt: string;

  @UpdateDateColumn()
  updatedAt: string;

  @Exclude()
  @DeleteDateColumn()
  deletedAt: string;
}
